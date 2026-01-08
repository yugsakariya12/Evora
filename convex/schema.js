import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /* =========================
     USERS TABLE
     ========================= */
  users: defineTable({
    // Clerk auth
    email: v.string(),
    tokenIdentifier: v.string(), // Clerk user ID (sub)
    name: v.string(),
    imageUrl: v.optional(v.string()),

    // Onboarding
    hasCompletedOnboarding: v.boolean(),

    // Attendee preferences
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
      })
    ),
    interests: v.optional(v.array(v.string())),

    // Organizer tracking
    freeEventsCreated: v.number(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  /* =========================
     EVENTS TABLE
     ========================= */
  events: defineTable({
    // Basic info
    title: v.string(),
    description: v.string(),
    slug: v.string(),

    // Organizer (relation)
    organizerId: v.id("users"),
    organizerName: v.string(),

    // Categorization
    category: v.string(),
    tags: v.array(v.string()),

    // Date & time
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),

    // Location
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),

    // Capacity & ticketing
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    registrationCount: v.number(),

    // Customization
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_start_date", ["startDate"])
    .searchIndex("search_title",{searchField:"title"}),
  /* =========================
     REGISTRATIONS / TICKETS
     ========================= */
  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),

    attendeeName: v.string(),
    attendeeEmail: v.string(),

    // QR code for entry
    qrCode: v.string(),

    // Check-in
    checkedIn: v.boolean(),
    checkedInAt: v.optional(v.number()),

    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled")
    ),

    registeredAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_qr_code", ["qrCode"]),
});
