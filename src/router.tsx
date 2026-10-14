import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { VaultClientPage } from './pages/VaultClientPage'
import { TransfersPage } from './pages/TransfersPage'
import { LedgerSearchPage } from './pages/LedgerSearchPage'
import { ExecutivePage } from './pages/ExecutivePage'
import { SwiftImportPage } from './pages/SwiftImportPage'
import { HeritagePage } from './pages/HeritagePage'
import { RobotsPage } from './pages/RobotsPage'
import { EnvPage } from './pages/EnvPage'

// Root route wrapping all pages in institutional layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

// Specific route declarations
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const vaultClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vault/client',
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: (search.id as string) || '1042',
    }
  },
  component: VaultClientPage,
})

const transfersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transfers',
  component: TransfersPage,
})

const ledgerSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ledger-search',
  component: LedgerSearchPage,
})

const executiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/executive',
  component: ExecutivePage,
})

const swiftImportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/swift-import',
  component: SwiftImportPage,
})

const heritageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/heritage',
  component: HeritagePage,
})

// Dedicated special routes for OWASP A02:2025
const robotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/robots.txt',
  component: RobotsPage,
})

const dotEnvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/.env',
  component: EnvPage,
})

const envRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/env',
  component: EnvPage,
})

// Route tree assembly
const routeTree = rootRoute.addChildren([
  indexRoute,
  vaultClientRoute,
  transfersRoute,
  ledgerSearchRoute,
  executiveRoute,
  swiftImportRoute,
  heritageRoute,
  robotsRoute,
  dotEnvRoute,
  envRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
