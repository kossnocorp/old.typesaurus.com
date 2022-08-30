import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export function Navigation({ navigation, className }) {
  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-9">
        {navigation.map((section, index) => (
          <Section key={index} section={section} />
        ))}
      </ul>
    </nav>
  )
}

function Section({ section }) {
  switch (section.type) {
    case 'groups':
      return <GroupsSection section={section} />

    case 'links':
      return <LinksSection section={section} />
  }
}

function GroupsSection({ section }) {
  return (
    <li key={section.title}>
      <h2 className="font-display font-medium text-slate-900 dark:text-white">
        {section.title}
      </h2>

      <ul role="list" className="mt-4 space-y-4">
        {section.groups.map((section, index) => (
          <li key={section.title}>
            <h3 className="font-display text-slate-400 dark:text-slate-500">
              {section.title}
            </h3>

            <Links links={section.links} />
          </li>
        ))}
      </ul>
    </li>
  )
}

function LinksSection({ section }) {
  return (
    <li key={section.title}>
      <h2 className="font-display font-medium text-slate-900 dark:text-white">
        {section.title}
      </h2>

      <Links links={section.links} />
    </li>
  )
}

function Links({ links }) {
  const router = useRouter()

  return (
    <ul
      role="list"
      className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
    >
      {links.map((link) => (
        <li key={link.href} className="relative">
          <Link
            href={link.href}
            className={clsx(
              'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
              link.href === router.pathname
                ? 'font-semibold text-sky-500 before:bg-sky-500'
                : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
            )}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
