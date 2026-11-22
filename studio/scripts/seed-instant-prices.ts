import {getCliClient} from 'sanity/cli'
import {initialPricing, pricingSections} from '../../data/estimate-pricing'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({perspective: 'raw', useCdn: false})

async function seed() {
  const ids = pricingSections.flatMap((section) => [section.documentId, `drafts.${section.documentId}`])
  const existing = await client.fetch<{_id: string}[]>('*[_id in $ids]{_id}', {ids})
  const found = new Set(existing.map((document) => document._id))
  const missing = pricingSections.filter((section) =>
    !found.has(section.documentId) && !found.has(`drafts.${section.documentId}`),
  )

  if (!missing.length) {
    console.log('All pricing sections already exist; nothing changed.')
    return
  }

  const transaction = client.transaction()
  for (const section of missing) {
    transaction.createIfNotExists({
      _id: `drafts.${section.documentId}`,
      _type: section.schemaType,
      ...initialPricing(section.tab),
    })
  }
  const dryRun = process.env.INSTANT_PRICES_DRY_RUN === '1'
  if (!dryRun) await transaction.commit()
  console.log(`${dryRun ? 'Would create' : 'Created'} drafts with current calculator prices:`)
  missing.forEach((section) => console.log(`- ${section.title}`))
  console.log('Existing prices are never overwritten. Nothing has been published.')
}

seed().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
