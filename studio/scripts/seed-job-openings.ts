import {getCliClient} from 'sanity/cli'
import {starterJobOpenings} from '../../data/careers'

// One-time copy of the starter roles in data/careers.ts into Sanity, so the
// sponsor starts with the roles the website showed before Sanity.
// Run it from the studio folder with: npm run seed:job-openings
// Roles already in Sanity (same URL slug) are left alone, so running it twice is safe.

const client = getCliClient({apiVersion: '2026-10-19'})

async function seed() {
  const existingSlugs = await client.fetch<string[]>('*[_type == "jobOpening"].slug.current')

  const transaction = client.transaction()
  const added: string[] = []

  starterJobOpenings.forEach((opening, index) => {
    if (existingSlugs.includes(opening.slug)) return

    transaction.createIfNotExists({
      // No dot in the ID, so the website can read it without signing in.
      _id: `jobOpening-${opening.slug}`,
      _type: 'jobOpening',
      title: opening.title,
      slug: {_type: 'slug', current: opening.slug},
      employmentType: opening.employmentType,
      ...(opening.pay ? {pay: opening.pay} : {}),
      summary: opening.summary,
      duties: opening.duties,
      requirements: opening.requirements,
      ...(opening.schedule ? {schedule: opening.schedule} : {}),
      displayOrder: index + 1,
      accepting: true,
    })
    added.push(opening.title)
  })

  await transaction.commit()

  console.log(
    added.length > 0
      ? `Added ${added.length} job openings: ${added.join(', ')}.`
      : 'Every starter role was already in Sanity, so none were added.',
  )
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
