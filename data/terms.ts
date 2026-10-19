// Keep the supplied policy text separate from the page layout.
// The effective date is unconfirmed; section headings use sentence case.
export type TermsBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: readonly string[] };

export type TermsSection = {
  number: number;
  id: string;
  title: string;
  blocks: readonly TermsBlock[];
};

export const termsEffectiveDate = 'To be confirmed';

export const termsIntroduction: readonly string[] = [
  "These Appointment, Cancellation & Service Terms apply to appointments scheduled with Clear Impression Window Cleaning (\"Clear Impression,\" \"we,\" \"us,\" or \"our\").",
  "By accepting an estimate, scheduling an appointment, providing a payment card for an appointment, and/or replying electronically to confirm the appointment, the customer acknowledges and agrees to these terms."
];

export const termsSections: readonly TermsSection[] = [
  {
    "number": 1,
    "id": "term-1",
    "title": "Appointment reservation",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "When an appointment is scheduled, Clear Impression reserves a specific date and time or arrival window for the customer and may allocate technicians, equipment, vehicles, and other resources specifically for the scheduled service."
      },
      {
        "kind": "paragraph",
        "text": "Because that time is reserved specifically for the customer, timely notice of cancellations or changes is important."
      },
      {
        "kind": "paragraph",
        "text": "An appointment is considered confirmed when the customer electronically confirms the appointment, including by replying \"YES\" to a confirmation message when requested."
      }
    ]
  },
  {
    "number": 2,
    "id": "term-2",
    "title": "Card on file",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Clear Impression may require a valid payment card to be kept on file to reserve an appointment."
      },
      {
        "kind": "paragraph",
        "text": "Keeping a card on file does not itself create a charge."
      },
      {
        "kind": "paragraph",
        "text": "The card may be charged only for amounts authorized under the applicable booking terms, including applicable cancellation, rescheduling, no-show, or other expressly disclosed charges."
      },
      {
        "kind": "paragraph",
        "text": "By confirming an appointment and providing a card on file, the customer authorizes Clear Impression to charge the card for applicable charges expressly described in these terms."
      }
    ]
  },
  {
    "number": 3,
    "id": "term-3",
    "title": "Cancellations",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Customers may cancel an appointment at any time. We ask that customers provide as much notice as possible."
      },
      {
        "kind": "paragraph",
        "text": "Cancellations made more than 7 days before the scheduled service date will generally not incur a cancellation fee."
      },
      {
        "kind": "paragraph",
        "text": "Cancellations made within 7 days of the scheduled service date may be subject to a fee of up to 25% of the quoted service price."
      },
      {
        "kind": "paragraph",
        "text": "Cancellations made within 24 hours of the scheduled service time may be subject to a fee of up to 50% of the quoted service price."
      },
      {
        "kind": "paragraph",
        "text": "No-show appointments may be charged up to 100% of the scheduled service price."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression may reduce or waive a cancellation fee at its discretion based on the circumstances."
      },
      {
        "kind": "paragraph",
        "text": "Any cancellation charge will be limited to the amount permitted by the applicable booking terms and applicable law."
      }
    ]
  },
  {
    "number": 4,
    "id": "term-4",
    "title": "Rescheduling",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Rescheduling is always welcome. Customers are encouraged to contact Clear Impression as soon as they know they need to make a change."
      },
      {
        "kind": "paragraph",
        "text": "An appointment may be rescheduled up to two times without requiring a new scheduling deposit."
      },
      {
        "kind": "paragraph",
        "text": "Appointments rescheduled more than two times may require a new scheduling deposit before another appointment can be reserved."
      },
      {
        "kind": "paragraph",
        "text": "Repeated postponement of an appointment may result in Clear Impression declining to reserve another appointment until a new scheduling deposit is received."
      },
      {
        "kind": "paragraph",
        "text": "Same-day requests to reschedule are treated as cancellations under this policy."
      }
    ]
  },
  {
    "number": 5,
    "id": "term-5",
    "title": "Weather policy",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Weather-related scheduling decisions are made by Clear Impression."
      },
      {
        "kind": "paragraph",
        "text": "Light rain does not typically affect window cleaning results and service may proceed as scheduled."
      },
      {
        "kind": "paragraph",
        "text": "If weather conditions prevent us from safely or properly performing the service, Clear Impression will automatically move the appointment to the next available weather-safe opening."
      },
      {
        "kind": "paragraph",
        "text": "Customers do not need to cancel because of weather. Clear Impression will make the determination and communicate any necessary schedule change."
      },
      {
        "kind": "paragraph",
        "text": "If Clear Impression determines that weather conditions prevent service, the appointment will be rescheduled rather than treated as a customer cancellation."
      },
      {
        "kind": "paragraph",
        "text": "Customer-requested weather postponements may be treated as cancellations under the normal cancellation policy."
      }
    ]
  },
  {
    "number": 6,
    "id": "term-6",
    "title": "Access to property",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Customers are responsible for providing reasonable access to all areas included in the quoted service."
      },
      {
        "kind": "paragraph",
        "text": "This may include:"
      },
      {
        "kind": "list",
        "items": [
          "Unlocking gates and doors necessary for the agreed service.",
          "Providing reasonable access to exterior service areas.",
          "Ensuring pets are safely secured.",
          "Providing access to water or electrical service when required for the agreed service.",
          "Providing reasonable parking or equipment access when necessary.",
          "Informing Clear Impression in advance about known access restrictions or hazards."
        ]
      },
      {
        "kind": "paragraph",
        "text": "If technicians arrive and cannot reasonably access the property or areas included in the scheduled service, the appointment may be treated as a cancellation or no-show and applicable fees may apply."
      }
    ]
  },
  {
    "number": 7,
    "id": "term-7",
    "title": "Pets and gates",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Customers are responsible for securing pets and ensuring that gates remain closed or otherwise managed according to the customer's instructions."
      },
      {
        "kind": "paragraph",
        "text": "If special gate, pet, alarm, or access instructions exist, they should be communicated to Clear Impression before the appointment."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression is not responsible for pets that escape because the customer has failed to provide appropriate instructions or secure the animal."
      },
      {
        "kind": "paragraph",
        "text": "Technicians may decline to enter an area when an unsafe animal, access condition, or other hazard is present."
      }
    ]
  },
  {
    "number": 8,
    "id": "term-8",
    "title": "Scope of work",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "The quoted price is based on the scope of work agreed upon when the service is scheduled."
      },
      {
        "kind": "paragraph",
        "text": "The customer may request additional services when technician availability permits."
      },
      {
        "kind": "paragraph",
        "text": "Additional services will be priced separately and approved by the customer before work is performed whenever reasonably possible."
      }
    ]
  },
  {
    "number": 9,
    "id": "term-9",
    "title": "Additional services and technician incentives",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "When additional services are identified during an appointment, technicians may inform the customer about available services."
      },
      {
        "kind": "paragraph",
        "text": "Additional work is not required and will not be performed without customer authorization."
      },
      {
        "kind": "paragraph",
        "text": "Any applicable technician compensation or incentive for identifying additional services does not change the customer's quoted price unless the additional service itself has been approved."
      }
    ]
  },
  {
    "number": 10,
    "id": "term-10",
    "title": "Scope reductions",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "If the customer materially reduces the agreed scope of work shortly before or on the scheduled service date, the change may be treated as a partial cancellation when the reduction materially affects the time, staffing, equipment, or revenue reserved for the appointment."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression may adjust the service price or apply an applicable cancellation charge based on the circumstances."
      }
    ]
  },
  {
    "number": 11,
    "id": "term-11",
    "title": "Customer declines service after arrival",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "If a technician arrives at the property and the customer declines the scheduled service, refuses access, or materially changes the scope of work such that the scheduled service cannot reasonably be completed, the appointment may be treated as a cancellation."
      },
      {
        "kind": "paragraph",
        "text": "Applicable cancellation or no-show charges may apply."
      }
    ]
  },
  {
    "number": 12,
    "id": "term-12",
    "title": "Appointment arrival windows",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Appointment times may be provided as an estimated arrival time or arrival window rather than a guaranteed arrival time."
      },
      {
        "kind": "paragraph",
        "text": "Arrival times may be affected by traffic, weather, previous appointments, equipment issues, customer requests, emergencies, or other circumstances outside Clear Impression's reasonable control."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression will make reasonable efforts to communicate significant delays."
      }
    ]
  },
  {
    "number": 13,
    "id": "term-13",
    "title": "Scheduling deposits",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Clear Impression may require a scheduling deposit for larger residential appointments, commercial projects, full-day appointments, specially scheduled appointments, or other jobs where significant company resources or calendar capacity are being reserved."
      },
      {
        "kind": "paragraph",
        "text": "The required deposit amount will be disclosed before the deposit is collected."
      },
      {
        "kind": "paragraph",
        "text": "Unless otherwise stated in writing, the scheduling deposit will be credited toward the customer's final service balance."
      },
      {
        "kind": "paragraph",
        "text": "A deposit does not replace the customer's obligation to comply with the cancellation and rescheduling terms."
      }
    ]
  },
  {
    "number": 14,
    "id": "term-14",
    "title": "Deposit cancellation terms",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "When a scheduling deposit has been collected, the deposit may be retained in whole or in part when the customer cancels, repeatedly reschedules, or otherwise fails to proceed with the scheduled service in circumstances covered by the cancellation terms."
      },
      {
        "kind": "paragraph",
        "text": "The amount retained will be determined according to the applicable booking terms and circumstances."
      },
      {
        "kind": "paragraph",
        "text": "If Clear Impression cancels the service for reasons attributable to Clear Impression and the customer does not wish to reschedule, the deposit will be refunded or otherwise handled as required by the applicable agreement and law."
      }
    ]
  },
  {
    "number": 15,
    "id": "term-15",
    "title": "Payment",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Unless different payment terms have been agreed to in writing, the final service balance is due on the date of service."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression may accept credit/debit card, cash, Zelle, or other payment methods offered by the company."
      },
      {
        "kind": "paragraph",
        "text": "Payment-method availability may vary."
      },
      {
        "kind": "paragraph",
        "text": "Any applicable payment-processing charge, surcharge, or cash/Zelle discount will be disclosed to the customer before payment."
      }
    ]
  },
  {
    "number": 16,
    "id": "term-16",
    "title": "Card processing",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "If Clear Impression applies a card-processing charge or different pricing based on payment method, the applicable amount will be disclosed to the customer before payment and administered in accordance with applicable law and payment-network rules."
      }
    ]
  },
  {
    "number": 17,
    "id": "term-17",
    "title": "No-shows",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "A no-show occurs when the customer or authorized representative is unavailable or unable to provide access necessary to perform the scheduled service and the appointment cannot reasonably proceed."
      },
      {
        "kind": "paragraph",
        "text": "No-show appointments may be charged up to 100% of the scheduled service price, subject to the applicable booking terms and law."
      }
    ]
  },
  {
    "number": 18,
    "id": "term-18",
    "title": "Property conditions and hazards",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Customers should disclose known conditions that could affect the safe performance of the service, including hazardous areas, fragile surfaces, difficult access, construction, aggressive animals, or other unusual conditions."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression may refuse or modify service when conditions present an unreasonable safety risk to employees, contractors, customers, property, or equipment."
      }
    ]
  },
  {
    "number": 19,
    "id": "term-19",
    "title": "Pre-existing conditions and damage",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "The customer is responsible for disclosing known pre-existing damage, defects, failed seals, cracked glass, damaged screens, loose trim, deteriorated frames, or other fragile conditions before service."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression will use reasonable care during service but cannot guarantee that pre-existing defects will remain unchanged."
      }
    ]
  },
  {
    "number": 20,
    "id": "term-20",
    "title": "Service scope and results",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Window cleaning and related services are performed according to the agreed scope of work and the condition of the property."
      },
      {
        "kind": "paragraph",
        "text": "Certain permanent or difficult-to-remove conditions, including hard-water staining, mineral deposits, oxidation, deteriorated seals, paint, construction debris, scratches, etched glass, and other damage may not be completely removable through standard cleaning."
      },
      {
        "kind": "paragraph",
        "text": "Where applicable, Clear Impression may recommend additional restoration or treatment services."
      }
    ]
  },
  {
    "number": 21,
    "id": "term-21",
    "title": "Touch-up / weather-related quality policy",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "If weather conditions affect the appearance of a completed window cleaning within 24 hours of service, Clear Impression will evaluate the affected area and, when appropriate, return to address weather-related spotting at no additional charge."
      },
      {
        "kind": "paragraph",
        "text": "This does not apply to pre-existing glass damage, mineral deposits, hard-water staining, construction debris, or other conditions unrelated to weather following the cleaning."
      }
    ]
  },
  {
    "number": 22,
    "id": "term-22",
    "title": "Customer-confirmed terms",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Clear Impression may provide these terms by text message, email, estimate, proposal, invoice, website, or another electronic method."
      },
      {
        "kind": "paragraph",
        "text": "When requested, the customer may confirm acceptance by replying \"YES\" or using another electronic acceptance method."
      },
      {
        "kind": "paragraph",
        "text": "The electronic record of the terms presented to the customer and the customer's acceptance may be retained by Clear Impression as part of the appointment record."
      }
    ]
  },
  {
    "number": 23,
    "id": "term-23",
    "title": "Communication",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Customers are responsible for providing accurate contact information and checking appointment-related communications."
      },
      {
        "kind": "paragraph",
        "text": "Clear Impression may use text messages, telephone calls, email, or other reasonable communication methods to provide appointment confirmations, reminders, scheduling updates, weather updates, payment information, and service-related communications."
      }
    ]
  },
  {
    "number": 24,
    "id": "term-24",
    "title": "Appointment reminders",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "For appointments scheduled significantly in advance, Clear Impression may send periodic reminders, including approximately 30 days before service, 7 days before service, and approximately 24 hours before service."
      },
      {
        "kind": "paragraph",
        "text": "A reminder does not create a new contract or replace the original booking terms."
      },
      {
        "kind": "paragraph",
        "text": "The 7-day reminder is intended to provide the customer with an additional opportunity to notify Clear Impression of any requested change before the appointment enters the cancellation-fee period."
      }
    ]
  },
  {
    "number": 25,
    "id": "term-25",
    "title": "Company discretion",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Clear Impression may waive, reduce, or modify a cancellation or rescheduling charge based on the circumstances."
      },
      {
        "kind": "paragraph",
        "text": "Examples may include emergencies, severe illness, family emergencies, or other circumstances Clear Impression determines warrant an exception."
      },
      {
        "kind": "paragraph",
        "text": "Any waiver is discretionary and does not establish a permanent exception to the policy."
      }
    ]
  },
  {
    "number": 26,
    "id": "term-26",
    "title": "Policy changes",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Clear Impression may update these terms from time to time."
      },
      {
        "kind": "paragraph",
        "text": "The terms applicable to an appointment are the terms provided to and accepted by the customer when the appointment is scheduled or subsequently modified."
      }
    ]
  },
  {
    "number": 27,
    "id": "term-27",
    "title": "Customer acknowledgment",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "By confirming an appointment electronically, signing an estimate or proposal, or otherwise accepting the appointment after being provided these terms, the customer acknowledges that they have had an opportunity to review the appointment, cancellation, rescheduling, weather, payment, and access terms."
      },
      {
        "kind": "paragraph",
        "text": "CUSTOMER CONFIRMATION:"
      },
      {
        "kind": "paragraph",
        "text": "\"I have reviewed and agree to the Clear Impression appointment and service terms provided to me.\""
      },
      {
        "kind": "paragraph",
        "text": "Electronic confirmation such as \"YES\" may be used when requested by Clear Impression."
      }
    ]
  }
];

// Jump to a numbered section without hiding any of the terms.
export const termsNavigation = [
  { href: '#term-1', label: 'Appointment planning' },
  { href: '#term-3', label: 'Cancellations & changes' },
  { href: '#term-6', label: 'Property access' },
  { href: '#term-13', label: 'Deposits & payment' },
  { href: '#term-18', label: 'Service & quality' },
  { href: '#term-22', label: 'Confirmations & updates' },
] as const;
