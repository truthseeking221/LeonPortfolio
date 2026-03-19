import Contact from '@/framer/contact'
import SubmitButton from '@/framer/submit-button'
import { CONTACT } from '@/constants'

export default function ContactSection() {
  return (
    <section className="contents">
      <Contact.Responsive
        T8wjmfFFv={CONTACT.email}
        UevP3H2qk={CONTACT.emailLink}
        s1W_Zr6Qz={CONTACT.phone}
        yQr_nvvaX={CONTACT.phoneLink}
        zZjVo4iDN={CONTACT.headline}
      />
      <SubmitButton.Responsive />
    </section>
  )
}
