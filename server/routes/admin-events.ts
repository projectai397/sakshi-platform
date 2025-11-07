import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { getDb } from '../db';
import { events, eventRegistrations, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Admin Event Management Workflow
 * Handles event creation, updates, and registration management
 */

const createEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['repair', 'swap', 'upcycle', 'meditation', 'retreat']),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  maxParticipants: z.number().optional(),
  sevaTokensReward: z.number().default(2),
  imageUrl: z.string().optional(),
});

const updateEventSchema = createEventSchema.extend({
  id: z.number(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
});

export const adminEventsRouter = router({
  // Create new event
  createEvent: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [newEvent] = await db
        .insert(events)
        .values({
          ...input,
          createdBy: ctx.user.id,
          status: 'upcoming',
          createdAt: new Date(),
        })
        .returning();

      return newEvent;
    }),

  // Update event
  updateEvent: protectedProcedure
    .input(updateEventSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updateData } = input;

      const [updatedEvent] = await db
        .update(events)
        .set(updateData)
        .where(eq(events.id, id))
        .returning();

      return updatedEvent;
    }),

  // Delete event
  deleteEvent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .delete(events)
        .where(eq(events.id, input.id));

      return { success: true };
    }),

  // Get all events with registration counts
  getAllEvents: protectedProcedure
    .query(async () => {
      const db = getDb();
      
      const allEvents = await db
        .select()
        .from(events)
        .orderBy(events.date);

      // Get registration counts for each event
      const eventsWithCounts = await Promise.all(
        allEvents.map(async (event) => {
          const registrations = await db
            .select()
            .from(eventRegistrations)
            .where(eq(eventRegistrations.eventId, event.id));

          return {
            ...event,
            registrationCount: registrations.length,
            attendedCount: registrations.filter(r => r.attended).length,
          };
        })
      );

      return eventsWithCounts;
    }),

  // Get event registrations
  getEventRegistrations: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      const registrations = await db
        .select({
          registration: eventRegistrations,
          user: users,
        })
        .from(eventRegistrations)
        .leftJoin(users, eq(eventRegistrations.userId, users.id))
        .where(eq(eventRegistrations.eventId, input.eventId));

      return registrations;
    }),

  // Mark attendance
  markAttendance: protectedProcedure
    .input(z.object({
      registrationId: z.number(),
      attended: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const [registration] = await db
        .update(eventRegistrations)
        .set({ attended: input.attended })
        .where(eq(eventRegistrations.id, input.registrationId))
        .returning();

      // If marking as attended, award seva tokens
      if (input.attended && registration.userId) {
        const [event] = await db
          .select()
          .from(events)
          .where(eq(events.id, registration.eventId));

        if (event) {
          await db
            .update(users)
            .set({
              sevaTokens: db.select({ tokens: users.sevaTokens })
                .from(users)
                .where(eq(users.id, registration.userId))
                .then(r => (r[0]?.tokens || 0) + (event.sevaTokensReward || 2)),
            })
            .where(eq(users.id, registration.userId));
        }
      }

      return { success: true };
    }),

  // Get event statistics
  getEventStats: protectedProcedure
    .query(async () => {
      const db = getDb();
      
      const allEvents = await db.select().from(events);
      const allRegistrations = await db.select().from(eventRegistrations);

      const upcoming = allEvents.filter(e => e.status === 'upcoming').length;
      const completed = allEvents.filter(e => e.status === 'completed').length;
      const totalRegistrations = allRegistrations.length;
      const totalAttended = allRegistrations.filter(r => r.attended).length;

      return {
        totalEvents: allEvents.length,
        upcoming,
        completed,
        totalRegistrations,
        totalAttended,
        averageAttendance: totalRegistrations > 0 
          ? Math.round((totalAttended / totalRegistrations) * 100) 
          : 0,
      };
    }),
});
