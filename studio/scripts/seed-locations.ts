import {createReadStream} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import {
  cityPageContent,
  defaultCityMedia,
  locationPages,
  locationServices,
  locationsPageContent,
} from '../../data/locations'

// One-time copy of the cities and Locations page text from data/locations.ts
// into Sanity, so the sponsor starts with what the website shows today.
// Run it from the studio folder with: npm run seed:locations
// Anything already in Sanity is left alone, so running it twice is safe.

const client = getCliClient({apiVersion: '2026-10-19'})

type HeaderDocument = {_id: string; pageId: string; title?: string; subtitle?: string}

async function seed() {
  const existingSlugs = await client.fetch<string[]>('*[_type == "city"].slug.current')

  // Keep any heading or intro already typed into the old city page headers.
  const headers = await client.fetch<HeaderDocument[]>(`
    *[
      _type == "pageHeader" &&
      string::startsWith(pageId, "location") &&
      !(_id in path("drafts.**"))
    ] {_id, pageId, title, subtitle}
  `)
  const savedHeader = (pageId: string) => headers.find((header) => header.pageId === pageId)

  const transaction = client.transaction()
  const added: string[] = []

  locationPages.forEach((location, index) => {
    if (existingSlugs.includes(location.slug)) return

    const header = savedHeader(`location-${location.slug}`)
    transaction.createIfNotExists({
      // No dot in the ID, so the website can read it without signing in.
      _id: `city-${location.slug}`,
      _type: 'city',
      name: location.name,
      slug: {_type: 'slug', current: location.slug},
      published: true,
      title: header?.title?.trim() || location.title,
      intro: header?.subtitle?.trim() || location.intro,
      description: location.description,
      region: location.region,
      latitude: location.coordinates[0],
      longitude: location.coordinates[1],
      displayOrder: index + 1,
    })
    added.push(location.name)
  })

  const pageExists = await client.getDocument('locationsPage')
  if (!pageExists) {
    // Upload today's city page photo, so the shared slot shows it in Studio.
    const photoUrl = defaultCityMedia.photo?.url ?? ''
    const photoPath = path.join(process.cwd(), '..', 'public', photoUrl)
    const photo = await client.assets.upload('image', createReadStream(photoPath), {
      filename: path.basename(photoPath),
    })

    transaction.createIfNotExists({
      _id: 'locationsPage',
      _type: 'locationsPage',
      eyebrow: locationsPageContent.eyebrow,
      citiesHeading: locationsPageContent.citiesHeading,
      citiesDescription: locationsPageContent.citiesDescription,
      nextHeading: locationsPageContent.nextHeading,
      nextText: locationsPageContent.nextText,
      servicesLabel: locationsPageContent.servicesLabel,
      media: {
        _type: 'photoOrVideo',
        photo: {_type: 'image', asset: {_type: 'reference', _ref: photo._id}},
        alt: defaultCityMedia.alt,
      },
      photoEyebrow: cityPageContent.photoEyebrow,
      photoHeading: cityPageContent.photoHeading,
      quoteLabel: cityPageContent.quoteLabel,
      servicesDescription: cityPageContent.servicesDescription,
      servicesLinkLabel: cityPageContent.servicesLinkLabel,
      backLabel: cityPageContent.backLabel,
      services: locationServices.map((service, index) => ({
        _key: `service-${index}`,
        _type: 'locationService',
        ...service,
      })),
    })
  }

  // The Locations subtitle can count the cities by itself now.
  const locationsHeader = savedHeader('locations')
  const hardCodedCount = `${locationPages.length} cities`
  if (locationsHeader?.subtitle?.includes(hardCodedCount)) {
    transaction.patch(locationsHeader._id, (patch) =>
      patch.set({subtitle: locationsHeader.subtitle?.replace(hardCodedCount, '{count} cities')}),
    )
  }

  await transaction.commit()

  console.log(
    added.length > 0
      ? `Added ${added.length} cities: ${added.join(', ')}.`
      : 'Every city was already in Sanity, so none were added.',
  )
  console.log(pageExists ? 'The Locations page was already in Sanity.' : 'Added the Locations page.')
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
