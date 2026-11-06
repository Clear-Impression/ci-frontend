import {client} from '@/sanity/client'
import {SERVICES_QUERY} from '@/sanity/queries'
import {
  coreServices,
  howWeDoIt,
  specializedServices,
  type Service,
} from '@/data/services'

type ServiceDocument = Service & {
  category: 'method' | 'core' | 'specialized'
}

const localServices = [...howWeDoIt, ...coreServices, ...specializedServices]

export async function getServices(): Promise<ServiceDocument[]> {
  try {
    const services = await client.fetch<ServiceDocument[]>(
      SERVICES_QUERY,
      {},
      {next: {revalidate: 60}},
    )

    return services.length > 0
      ? services
      : localServices.map((service) => ({
          ...service,
          category: howWeDoIt.some((item) => item.slug === service.slug)
            ? 'method'
            : specializedServices.some((item) => item.slug === service.slug)
              ? 'specialized'
              : 'core',
        }))
  } catch (error) {
    console.error('Unable to load services from backend.', error)
    return localServices.map((service) => ({
      ...service,
      category: howWeDoIt.some((item) => item.slug === service.slug)
        ? 'method'
        : specializedServices.some((item) => item.slug === service.slug)
          ? 'specialized'
          : 'core',
    }))
  }
}
