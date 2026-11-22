import type {StructureResolver} from 'sanity/structure'
import {pageHeaders} from '../data/page-headers'
import {pricingSections} from '../data/estimate-pricing'

export const structure: StructureResolver = (S) => {
  const header = (pageId: string, title = 'Page header') => S.listItem()
    .id(`${pageId}-header`)
    .title(title)
    .child(S.document()
      .schemaType('pageHeader')
      .documentId(`pageHeader.${pageId}`)
      .title(`${pageHeaders[pageId].label} header`)
      .initialValueTemplate('page-header', {pageId}))

  const services = (category: string, title: string) => S.listItem()
    .id(`services-${category}`)
    .title(title)
    .child(S.documentTypeList('service')
      .id(`services-${category}`)
      .title(title)
      .apiVersion('2026-10-19')
      .filter('_type == "service" && category == $category')
      .params({category})
      .defaultOrdering([{field: 'displayOrder', direction: 'asc'}, {field: 'title', direction: 'asc'}])
      .initialValueTemplates([S.initialValueTemplateItem('service-category', {category})]))

  return S.list().title('Content').items([
    // At the top so it's easy to find when a new season starts.
    S.listItem().id('seasonal-offers').title('Seasonal offers').child(S.document()
      .schemaType('seasonalOffers')
      .documentId('seasonalOffers')
      .title('Seasonal offers')),
    S.listItem().id('instant-customer-prices').title('Instant customer prices')
      .child(S.list().title('Instant customer prices').items(pricingSections.map((section) =>
        S.listItem().id(section.tab.slug).title(section.title)
          .child(S.document().schemaType(section.schemaType).documentId(section.documentId).title(section.title)),
      ))),
    S.listItem().id('faq').title('FAQ').child(S.list().title('FAQ').items([
      header('faq'),
      S.documentTypeListItem('faq').title('Questions'),
    ])),
    S.documentTypeListItem('blog').title('Blog'),
    S.listItem().id('about-page').title('About page').child(S.document()
      .schemaType('about')
      .documentId('about')
      .title('About page')),
    S.listItem().id('services').title('Services').child(S.list().title('Services').items([
      header('services'),
      services('method', 'Methods'),
      services('core', 'Core services'),
      services('specialized', 'Specialized services'),
    ])),
    // Each city's heading and intro now live in its City document.
    S.listItem().id('locations').title('Locations').child(S.list().title('Locations').items([
      header('locations'),
      S.listItem().id('locations-page').title('Locations page').child(S.document()
        .schemaType('locationsPage')
        .documentId('locationsPage')
        .title('Locations page')),
      S.listItem().id('cities').title('Cities').schemaType('city').child(S.documentTypeList('city')
        .id('cities')
        .title('Cities')
        .apiVersion('2026-10-19')
        .defaultOrdering([{field: 'displayOrder', direction: 'asc'}, {field: 'name', direction: 'asc'}])),
    ])),
    S.listItem().id('careers').title('Careers').child(S.list().title('Careers').items([
      header('careers'),
      S.listItem().id('job-openings').title('Job openings').schemaType('jobOpening')
        .child(S.documentTypeList('jobOpening')
          .id('job-openings')
          .title('Job openings')
          .apiVersion('2026-10-19')
          .defaultOrdering([{field: 'displayOrder', direction: 'asc'}, {field: 'title', direction: 'asc'}])),
    ])),
    ...['home', 'reviews', 'feedback', 'quote', 'terms'].map((pageId) =>
      S.listItem().id(pageId).title(pageHeaders[pageId].label)
        .child(S.list().title(pageHeaders[pageId].label).items([header(pageId)])),
    ),
  ])
}
