import addressMap from '../assets/type-icons/address-map.svg'
import call from '../assets/type-icons/call.svg'
import code from '../assets/type-icons/code.svg'
import customization from '../assets/type-icons/customization.svg'
import key from '../assets/type-icons/key.svg'
import mail from '../assets/type-icons/mail.svg'
import notes from '../assets/type-icons/notes.svg'
import wallet from '../assets/type-icons/wallet.svg'
import webLink from '../assets/type-icons/web-link.svg'
import youtube from '../assets/type-icons/youtube.svg'
import type { ItemType } from '../types'

export const typeIcons: Record<ItemType, string> = {
  Note: notes,
  Email: mail,
  Phone: call,
  Website: webLink,
  YouTube: youtube,
  'Crypto Wallet': wallet,
  'API Key': key,
  Code: code,
  Address: addressMap,
  Custom: customization,
}
