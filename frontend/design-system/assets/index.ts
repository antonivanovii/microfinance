import mascotApproved from './mascots/mascot-approved.png'
import mascotDeclined from './mascots/mascot-declined.png'
import mascotDocs from './mascots/mascot-docs.png'
import mascotEmpty from './mascots/mascot-empty.png'
import mascotError from './mascots/mascot-error.png'
import mascotHello from './mascots/mascot-hello.png'
import mascotOverdue from './mascots/mascot-overdue.png'
import mascotWait from './mascots/mascot-wait.png'

import objCards from './objects/obj-cards.png'
import objCheck from './objects/obj-check.png'
import objClock from './objects/obj-clock.png'
import objCoins from './objects/obj-coins.png'
import objDoc from './objects/obj-doc.png'
import objNotes from './objects/obj-notes.png'
import objRuble from './objects/obj-ruble.png'
import objShield from './objects/obj-shield.png'

export const MASCOTS = {
  hello: mascotHello,
  wait: mascotWait,
  approved: mascotApproved,
  declined: mascotDeclined,
  docs: mascotDocs,
  empty: mascotEmpty,
  overdue: mascotOverdue,
  error: mascotError,
} as const

export type MascotName = keyof typeof MASCOTS

export const OBJECTS = {
  cards: objCards,
  check: objCheck,
  clock: objClock,
  coins: objCoins,
  doc: objDoc,
  notes: objNotes,
  ruble: objRuble,
  shield: objShield,
} as const

export type ObjectName = keyof typeof OBJECTS
