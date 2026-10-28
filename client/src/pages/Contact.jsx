import { Mail, MapPin, MessageCircle, Phone, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { Seo } from '../components/Seo';
import { PageHero, Section } from '../components/ui';
import { useSettings } from '../hooks/useSettings';
import { whatsappLink } from '../utils/format';
export default function Contact() {
    const s = useSettings();
    const wa = whatsappLink(s.whatsappNumber, 'Hi RS Stack, I would like to schedule a free consultation for website development / SEO.');
    return (<>
      <Seo title="Contact RS Stack | Website Development & Local SEO Agency in Mohali" description="Get in touch with RS Stack in Phase 5 Mohali SAS Nagar Punjab 160059. Call/WhatsApp +91 98057 20962 for custom websites, Google Ads, and local SEO services." path="/contact" keywords={[
            'contact RS Stack Mohali',
            'website developer phone number Mohali',
            'SEO agency Phase 5 Mohali',
            'WhatsApp RS Stack 9805720962',
            'hire website designer SAS Nagar',
        ]}/>
      <PageHero eyebrow="Get In Touch" title="Schedule Your Free 30-Minute Growth Strategy Session" text="Share your business objectives with our technical engineers. We will analyze your search competition, existing website, and deliver an itemized roadmap and quote."/>
      <Section className="pt-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-6 rounded-2xl border border-secondary/20 bg-secondary/[0.03] p-5">
              <p className="text-sm font-semibold text-secondary flex items-center gap-2">
                <ShieldCheck className="h-4 w-4"/> 100% Confidential Discovery
              </p>
              <p className="mt-1 text-xs text-muted">
                No hard sales pitches. We provide an honest technical assessment of what will truly help your business grow online.
              </p>
            </div>
            <ContactForm source="contact-page"/>
          </div>

          <aside className="space-y-6" aria-label="Official Contact Information">
            <div className="card p-7 space-y-5">
              <h2 className="text-xl font-bold">Official Headquarters</h2>

              <div className="flex items-start gap-3.5 text-sm">
                <MapPin className="h-5 w-5 shrink-0 text-secondary mt-0.5"/>
                <div>
                  <strong className="block text-white font-medium">Office Address</strong>
                  <span className="text-muted leading-relaxed block mt-0.5 whitespace-pre-line">
                    {s.address || 'Phase 5, Mohali, SAS Nagar,\nPunjab 160059, India'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-secondary mt-0.5"/>
                <div>
                  <strong className="block text-white font-medium">Direct Phone Line</strong>
                  <a href={`tel:${(s.phone || '+919805720962').replace(/[^\d+]/g, '')}`} className="text-secondary hover:underline block mt-0.5 font-semibold">
                    {s.phone || '+91 98057 20962'}
                  </a>
                </div>
              </div>

              {wa && (<div className="flex items-start gap-3.5 text-sm">
                  <MessageCircle className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5"/>
                  <div>
                    <strong className="block text-white font-medium">Instant WhatsApp Support</strong>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold hover:underline block mt-0.5">
                      Chat on WhatsApp ({s.whatsappNumber || '+91 98057 20962'})
                    </a>
                  </div>
                </div>)}

              <div className="flex items-start gap-3.5 text-sm">
                <Mail className="h-5 w-5 shrink-0 text-secondary mt-0.5"/>
                <div>
                  <strong className="block text-white font-medium">Email Inquiries</strong>
                  <a href={`mailto:${s.contactEmail || 'contact@rs-stack.com'}`} className="text-muted hover:text-white block mt-0.5">
                    {s.contactEmail || 'contact@rs-stack.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm border-t border-white/10 pt-4">
                <Clock className="h-5 w-5 shrink-0 text-secondary mt-0.5"/>
                <div>
                  <strong className="block text-white font-medium">Business Hours</strong>
                  <span className="text-muted block mt-0.5">Monday to Saturday: 9:00 AM to 7:00 PM IST</span>
                  <span className="text-xs text-muted/70 block mt-0.5">Sunday: By Appointment</span>
                </div>
              </div>

              {wa && (<div className="pt-2">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold flex items-center justify-center gap-2 shadow-lg">
                    <MessageCircle className="h-5 w-5 fill-current"/>
                    Quick WhatsApp Quote
                  </a>
                </div>)}
            </div>

            {/* Embedded Google Map Card */}
            <div className="card overflow-hidden p-0 border border-white/10">
              <iframe title="RS Stack Phase 5 Mohali SAS Nagar Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13719.648118029517!2d76.71239846665798!3d30.718712316499834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fee0091ff1a77%3A0x6b107e3251c27891!2sPhase%205%2C%20Sector%2059%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab%20160059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="240" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
              <div className="p-4 bg-surface/80 flex items-center justify-between text-xs text-muted">
                <span>Phase 5, Mohali (SAS Nagar) 160059</span>
                <a href="https://maps.google.com/?q=Phase+5+Mohali+SAS+Nagar+160059" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline inline-flex items-center gap-1">
                  Open in Maps <ArrowRight className="h-3 w-3"/>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>);
}
