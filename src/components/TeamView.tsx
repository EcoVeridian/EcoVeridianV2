/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const TEAM_MEMBERS = [
  {
    name: 'Risith Kankanamge',
    role: 'Co-Founder & Lead Full-Stack Developer',
    blurb:
      'Architected the core platform and proprietary scoring engine. Engineered the browser extension end-to-end and established the web application\'s technical foundation.',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/risith-kankanamge/' },
      { label: 'Email', href: 'mailto:risithcha@gmail.com' },
    ],
  },
  {
    name: 'Santhosh Ilaiyaraja',
    role: 'Co-Founder & Lead Interface Architect',
    blurb:
      'Designs and optimizes the platform\'s visual layer. Oversees interface architecture, component engineering, and end-to-end frontend performance.',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/santhosh-ilaiyaraja' },
      { label: 'Email', href: 'mailto:santhoshilaiyaraja@gmail.com' },
    ],
  },
  {
    name: 'Ritvik Rajkumar',
    role: 'Co-Founder & Lead Product Engineer',
    blurb:
      'Drives product vision across user flows and feature design. Focuses on usability, interaction patterns, prototyping, and product flows across React/Tailwind.',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ritvik-sujan-rajkumar' },
      { label: 'Email', href: 'mailto:rajkumarritvik1@gmail.com' },
    ],
  },
] as const;

export default function TeamView() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-20 animate-fade-in">
      <div className="max-w-[760px] mb-12 md:mb-16 border-b-[0.5px] border-outline-variant pb-10">
        <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-on-surface-variant mb-4 font-semibold">
          Team
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Meet the Team</h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          The EcoVeridian team combines platform engineering, interface architecture, and product design to ship practical sustainability-focused tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {TEAM_MEMBERS.map((member) => (
          <article
            key={member.name}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 md:p-7 rounded-[2px] hover:border-primary/40 transition-colors duration-200"
          >
            <h2 className="font-serif text-2xl text-primary font-semibold leading-tight mb-2">{member.name}</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-secondary font-semibold mb-4">
              {member.role}
            </p>
            <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed mb-6">
              {member.blurb}
            </p>

            <div className="pt-4 border-t-[0.5px] border-outline-variant">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-surface-variant mb-3 font-semibold">
                Links
              </p>
              <div className="flex flex-wrap gap-2">
                {member.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] border-[0.5px] border-outline rounded-[2px] text-on-surface-variant bg-surface hover:border-primary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
