# Database Seeding System

This directory contains the complete database seeding infrastructure for the Railway Reservation System.

## Overview

The seeding system automatically populates the database with realistic Egyptian railway data including:

- **Stations**: 20 major Egyptian railway stations
- **Trains**: 10 trains with different configurations (Express, Standard, Local)
- **Seats**: Auto-generated based on train coach configurations
- **Trips**: Multiple trips covering popular routes across Egypt
- **Trip Stops**: Intermediate station stops with calculated arrival times

## Files Structure

```
seed/
├── README.md              # This file
├── seed.ts                # Entry point script
├── seed-helper.ts         # Generic seeding helper function
├── seed-data.ts           # All seed data arrays
└── database-seeder.ts     # Main seeder class with logic
```

## Quick Start

### Prerequisites

1. Ensure your database is running
2. Run migrations: `npm run db:migrate`
3. Set `DATABASE_URL` in your `.env` file

### Running the Seeder

```bash
npm run db:seed
```

This will:
1. Connect to your database
2. Seed all entities in the correct dependency order
3. Skip records that already exist (idempotent operation)
4. Display progress with detailed logging

### Example Output

```
🌱 Railway Database Seeder

================================

📡 Connecting to database...
✓ Database connection established

🌱 Starting database seeding...

📍 Seeding stations...
Stations: 20 inserted, 0 skipped (already exist)
✓ Station mapping built: 20 stations

🚂 Seeding trains...
Trains: 10 inserted, 0 skipped (already exist)
✓ Train mapping built: 10 trains

💺 Seeding seats...
Seats for EXP-001: 416 inserted, 0 skipped (already exist)
Seats for STD-101: 564 inserted, 0 skipped (already exist)
...
✓ Total seats configured: 4920

🛤️  Seeding trips...
Trips: 85 inserted, 0 skipped (already exist)
✓ Trips configured: 85

🛑 Seeding trip stops...
Trip stops for trip 12345678: 7 inserted, 0 skipped (already exist)
...
✓ Total trip stops configured: 425

✅ Database seeding completed successfully!

================================
✅ Seeding completed successfully!
================================
```

## Seed Data Details

### Stations (20 Egyptian Stations)

Major stations including:
- Cairo Ramses (القاهرة رمسيس)
- Alexandria (الإسكندرية)
- Luxor (الأقصر)
- Aswan (أسوان)
- Port Said (بورسعيد)
- And 15 more...

Each station has both English and Arabic names.

### Trains (10 Trains)

Three categories with different configurations:

**Express Trains** (Premium service):
- EXP-001, EXP-002, EXP-003
- Mix of First, Business, and Economy classes
- 8-10 coaches per train

**Standard Trains** (Mixed service):
- STD-101, STD-102, STD-103
- Balanced mix of classes
- 10 coaches per train

**Local Trains** (Economy only):
- LOC-201, LOC-202, LOC-203, LOC-204
- All Economy class
- 6-8 coaches per train

### Seats (Auto-generated)

Seats are automatically generated based on each train's coach configuration:

Example for EXP-001:
- 2 First class coaches × 40 seats = 80 seats
- 4 Business coaches × 48 seats = 192 seats
- 2 Economy coaches × 60 seats = 120 seats
- **Total: 392 seats**

Each seat has:
- Unique coach number
- Seat number within the coach
- Class (First, Business, or Economy)

### Routes (9 Major Routes)

Popular Egyptian railway routes:
- Cairo to Aswan (9 stops)
- Cairo to Alexandria (5 stops)
- Cairo to Luxor (8 stops)
- Alexandria to Port Said (6 stops)
- Cairo to Port Said (4 stops)
- Cairo to Suez (3 stops)
- Cairo to Mansoura (3 stops)
- Tanta to Kafr El Sheikh (2 stops)
- Cairo to Fayoum (4 stops)

### Trips (85+ Trips)

Trips are generated from templates with:
- Multiple departure times (morning, afternoon, evening)
- Spread over the next 30 days
- Varied frequencies (daily, every 2-3 days, etc.)

### Trip Stops (Intermediate Stations)

For each trip:
- Intermediate stations are automatically determined from the route
- Arrival times are calculated based on average travel time between stops
- Stop order is sequential (1, 2, 3...)
- Example: Cairo → Aswan includes stops at Giza, Beni Suef, Minya, Asyut, Sohag, Qena, Luxor

## Customization

### Adding More Stations

Edit `seed-data.ts` and add to `stationsData`:

```typescript
{
  stationEnglishName: 'New Station',
  stationArabicName: 'محطة جديدة',
}
```

### Adding More Trains

Edit `seed-data.ts` and add to `trainsData`:

```typescript
{
  trainNumber: 'NEW-001',
  coaches: [
    { class: 'First', count: 2, seatsPerCoach: 40 },
    { class: 'Economy', count: 4, seatsPerCoach: 60 },
  ],
}
```

### Adding More Routes

Edit `seed-data.ts` and add to `routesData`:

```typescript
{
  name: 'Cairo to New City',
  stations: ['Cairo Ramses', 'Intermediate Station', 'New City'],
  avgMinutesBetweenStops: 45,
}
```

### Adding More Trips

Edit `seed-data.ts` and add to `tripsTemplates`:

```typescript
{
  routeName: 'Cairo to New City',
  trainNumber: 'NEW-001',
  departureHour: 10,
  departureMinute: 30,
  daysFromNow: [0, 1, 2, 3, 4, 5],
}
```

## Architecture

### Seeding Order

The seeder respects entity dependencies:

1. **Stations** (independent)
2. **Trains** (independent)
3. **Seats** (depends on Trains)
4. **Trips** (depends on Stations + Trains)
5. **Trip Stops** (depends on Trips + Stations)

### Idempotency

The seeder is **idempotent** - running it multiple times will:
- Check for existing records before inserting
- Skip records that already exist
- Only insert new records
- Log both inserted and skipped counts

This is achieved through the `seedDataIfNotExist` helper that checks unique constraints.

### Helper Function

The generic `seedDataIfNotExist` helper accepts:
- Database instance
- Table schema
- Data array
- Condition function (defines uniqueness criteria)
- Optional log prefix

Example usage:

```typescript
await seedDataIfNotExist(
  db,
  stations,
  stationsData,
  item => ({ stationEnglishName: item.stationEnglishName }),
  'Stations'
);
```

## Troubleshooting

### Connection Error

```
❌ Error: DATABASE_URL environment variable is not set
```

**Solution**: Ensure `DATABASE_URL` is set in your `.env` file:

```env
DATABASE_URL=postgresql://railway:railway@localhost:5432/railway
```

### Foreign Key Errors

```
Error: Foreign key constraint violation
```

**Solution**: Ensure migrations are run before seeding:

```bash
npm run db:migrate
npm run db:seed
```

### Duplicate Key Errors

If you see duplicate key errors, the seeder will:
- Skip the duplicate record
- Continue with the next record
- Log the skipped count

This is expected behavior for idempotent seeding.

## Notes

- **Tickets are not seeded** because they require passenger/user accounts
- All timestamps are automatically set to current time or calculated relative times
- Train IDs and Station IDs are UUIDs generated by the database
- The seeder uses the same database schemas as the main application

## Related Commands

```bash
# Generate a new migration
npm run db:generate --name=migration_name

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Open Drizzle Studio to view seeded data
npm run db:studio
```

## Support

For issues or questions about the seeding system, refer to:
- Main README: `/README.md`
- Database schemas: `/src/*/schemas/*.schema.ts`
- Drizzle ORM docs: https://orm.drizzle.team/



