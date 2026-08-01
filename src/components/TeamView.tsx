/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTeam, useInterns } from '../content/ContentContext';

export default function TeamView() {
  const team = useTeam();
  const interns = useInterns();
  const visibleMembers = team.filter((member) => member.visible);
  const visibleInterns = interns.filter((intern) => intern.visible);

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
        {visibleMembers.map((member) => (
          <article
            key={member.slug}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 md:p-7 rounded-[2px] hover:border-primary/40 transition-colors duration-200"
          >
            {member.photoUrl && (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover border-[0.5px] border-outline-variant mb-4"
                referrerPolicy="no-referrer"
              />
            )}
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
                    href={link.url}
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

      {visibleInterns.length > 0 && (
        <div className="mt-16 md:mt-20 border-t-[0.5px] border-outline-variant pt-10">
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-on-surface-variant mb-4 font-semibold">
            Interns
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold mb-4">
            Our Interns
          </h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed max-w-[760px] mb-8">
            Students contributing to EcoVeridian research, engineering, and design work.
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {visibleInterns.map((intern) => (
              <li
                key={intern.slug}
                className="px-4 py-3 bg-surface-container-low border-[0.5px] border-outline-variant rounded-[2px]"
              >
                <p className="font-sans text-sm text-on-surface">{intern.name}</p>
                {intern.role && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-secondary font-semibold mt-1.5">
                    {intern.role}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
