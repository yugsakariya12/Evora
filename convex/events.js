import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),

    // 🔑 ONLY for logic, NOT stored
    hasPro: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    try {
      const user = await ctx.runQuery(internal.users.getCurrentUser);

      // ✅ SAFELY extract hasPro (default false)
      const hasPro = args.hasPro === true;

      // ❗ Remove hasPro from data before insert
      const { hasPro: _, ...eventData } = args;

      // SERVER-SIDE FREE LIMIT CHECK
      if (!hasPro && user.freeEventsCreated >= 1) {
        throw new Error(
          "Free event limit reached. Please upgrade to Pro."
        );
      }

      // SERVER-SIDE THEME COLOR CHECK
      const defaultColor = "#1e3a8a";
      const themeColor =
        hasPro && eventData.themeColor
          ? eventData.themeColor
          : defaultColor;

      // Generate slug
      const slug = eventData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // INSERT — ONLY schema fields
      const eventId = await ctx.db.insert("events", {
        ...eventData,
        themeColor,
        slug: `${slug}-${Date.now()}`,
        organizerId: user._id,
        organizerName: user.name,
        registrationCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Increment free count ONLY for free users
      if (!hasPro) {
        await ctx.db.patch(user._id, {
          freeEventsCreated: user.freeEventsCreated + 1,
        });
      }

      return eventId;
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  },
});



// Get event by slug
export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .unique();

    if (!event) return null;

    const organizer = await ctx.db.get(event.organizerId);

    return {
      ...event,
      organizerClerkId: organizer.tokenIdentifier,
    };
  },
});


// Get events by organizer
export const getMyEvents = query({
  handler: async (ctx) => {
   const user = await ctx.runQuery(internal.users.getCurrentUser);

if (!user) {
  return { unauthorized: true };
}

const events = await ctx.db
  .query("events")
  .withIndex("by_organizer", (q) => q.eq("organizerId", user._id))
  .order("desc")
  .collect();

return events;


    return events;
  },
});

// Delete event
export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer
    if (event.organizerId !== user._id) {
      throw new Error("You are not authorized to delete this event");
    }

    // Delete all registrations for this event
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    // Delete the event
    await ctx.db.delete(args.eventId);

    // Update free event count if it was a free event
    if (event.ticketType === "free" && user.freeEventsCreated > 0) {
      await ctx.db.patch(user._id, {
        freeEventsCreated: user.freeEventsCreated - 1,
      });
    }

    return { success: true };
  },
});