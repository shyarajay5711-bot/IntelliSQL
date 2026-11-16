
import { useEffect, useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  Database,
  Table2,
  GitBranch,
  Clock3,
  Activity,
  Zap,
  ArrowUpRight,
  Code2,
  CheckCircle2,
  CircleDot,
  AlertCircle,
  Loader2,
} from 'lucide-react'

import Sidebar from './components/layout/Sidebar'
import {
  getHealth,
  getDatabaseSchema,
  generateSQL,
  executeSQL,
  type DatabaseSchema,
  type SQLExecutionResponse,
} from './services/api'

const quickPrompts = [
  'Show me the top 10 customers by spending',
  'Find all pending orders',
  'Calculate total revenue this month',
]

const recentQueries = [
  {
    title: 'Top 10 customers by spending',
    sql: 'SELECT customers by total spending...',
    time: 'Sample',
    status: 'Preview',
  },
  {
    title: 'Monthly sales overview',
    sql: 'SELECT monthly sales summary...',
    time: 'Sample',
    status: 'Preview',
  },
  {
    title: 'Pending orders',
    sql: 'SELECT orders WHERE status = pending...',
    time: 'Sample',
    status: 'Preview',
  },
]

type ApiStatus = 'checking' | 'connected' | 'disconnected'

function App() {
  const [prompt, setPrompt] = useState('')
  const [notice, setNotice] = useState('')
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const [schema, setSchema] = useState<DatabaseSchema | null>(null)
  const [schemaError, setSchemaError] = useState('')

  const [generatedSql, setGeneratedSql] = useState('')
  const [queryResult, setQueryResult] =
    useState<SQLExecutionResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    let active = true

    async function loadDatabase() {
      try {
        const [health, databaseSchema] = await Promise.all([
          getHealth(),
          getDatabaseSchema(),
        ])

        if (!active) return

        if (health.api === 'online' && health.database === 'connected') {
          setApiStatus('connected')
        } else {
          setApiStatus('disconnected')
        }

        setSchema(databaseSchema)
        setSchemaError('')
      } catch {
        if (!active) return

        setApiStatus('disconnected')
        setSchemaError(
          'Unable to load database information. Check your backend server.',
        )
      }
    }

    loadDatabase()

    return () => {
      active = false
    }
  }, [])

  const tables = schema ? Object.entries(schema) : []

  const totalColumns = tables.reduce(
    (total, [, table]) => total + table.columns.length,
    0,
  )

  const totalRelationships = tables.reduce(
    (total, [, table]) => total + table.foreign_keys.length,
    0,
  )

  const selectPrompt = (value: string) => {
    setPrompt(value)
    setNotice('')
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setNotice('Please enter a question first.')
      return
    }

    if (apiStatus !== 'connected') {
      setNotice('Backend is not connected. Please start your backend server.')
      return
    }

    setIsGenerating(true)
    setNotice('Generating SQL with AI...')
    setGeneratedSql('')
    setQueryResult(null)

    try {
      const generation = await generateSQL(prompt.trim())

      setGeneratedSql(generation.sql)
      setNotice('SQL generated successfully. Executing query...')

      const result = await executeSQL(generation.sql)

      setQueryResult(result)
      setNotice(
        `Success! Query executed and ${result.row_count} records returned.`,
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.'

      setNotice(`Error: ${message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const statusLabel = {
    checking: 'Checking connection...',
    connected: 'API connected',
    disconnected: 'API not connected',
  }[apiStatus]

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#070711] text-zinc-100">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="pointer-events-none fixed right-0 top-40 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[150px]" />

      <Sidebar />

      <main className="relative z-10 min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#090914]/80 px-6 backdrop-blur-2xl md:px-10">
          <div>
            <p className="text-xs text-zinc-500">Workspace / Overview</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-400'
                    : apiStatus === 'checking'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-red-400'
                }`}
              />
              <span className="text-[11px] text-zinc-400">
                {statusLabel}
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/15 text-xs font-semibold text-indigo-200">
              JS
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1250px] px-6 py-9 md:px-10 md:py-12">
          {/* Welcome */}
          <section className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[1.8px] text-indigo-300">
                <Sparkles size={13} />
                INTELLIGENT DATABASE STUDIO
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-[40px]">
                Your data,{' '}
                <span className="text-indigo-300">in conversation.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Explore your database, ask questions in plain English, and turn
                ideas into powerful SQL queries.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 py-2.5">
              <Activity size={16} className="text-indigo-300" />
              <span className="text-xs text-zinc-300">
                Workspace overview
              </span>
            </div>
          </section>

          {/* AI Query Workspace */}
          <section className="relative overflow-hidden rounded-3xl border border-indigo-300/[0.16] bg-gradient-to-br from-[#17152b]/90 via-[#11111d]/95 to-[#11101a]/95 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.35)] md:p-8">
            <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-500/15 blur-[100px]" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-300">
                    <Sparkles size={21} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold">
                      Ask IntelliSQL
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      Natural language to SQL workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] text-zinc-400">
                  AI ASSISTANT
                </span>
              </div>

              <textarea
                value={prompt}
                onChange={(event) => {
                  setPrompt(event.target.value)
                  setNotice('')
                }}
                placeholder="Ask anything about your database..."
                className="min-h-[145px] w-full resize-y rounded-2xl border border-white/[0.07] bg-black/20 p-5 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-400/40 focus:bg-black/30"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[11px] text-zinc-500">
                  Be specific. IntelliSQL will help translate your question
                  into SQL.
                </p>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || apiStatus !== 'connected'}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate SQL
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

              {notice && (
                <p className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-400/15 bg-indigo-400/[0.06] px-4 py-3 text-xs text-indigo-200">
                  {isGenerating && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {!isGenerating && notice.startsWith('Error:') && (
                    <AlertCircle size={14} />
                  )}
                  {notice}
                </p>
              )}

              {/* Generated SQL */}
              {generatedSql && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-400/20 bg-black/30">
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Code2 size={15} className="text-indigo-300" />
                      <span className="text-xs font-semibold text-zinc-200">
                        Generated SQL
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400">
                      AI GENERATED
                    </span>
                  </div>

                  <pre className="overflow-x-auto p-5 text-xs leading-6 text-indigo-200">
                    <code>{generatedSql}</code>
                  </pre>
                </div>
              )}

              {/* Query Results */}
              {queryResult && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-black/20">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Table2 size={16} className="text-indigo-300" />
                      <span className="text-xs font-semibold text-zinc-200">
                        Query Results
                      </span>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-[10px] text-emerald-300">
                      {queryResult.row_count} rows returned
                    </span>
                  </div>

                  {queryResult.columns.length > 0 ? (
                    <div className="max-h-[420px] overflow-auto">
                      <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 bg-[#171525]">
                          <tr>
                            {queryResult.columns.map((column) => (
                              <th
                                key={column}
                                className="whitespace-nowrap border-b border-white/[0.08] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-indigo-200"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {queryResult.rows.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="border-b border-white/[0.05] transition hover:bg-white/[0.035]"
                            >
                              {queryResult.columns.map((column) => (
                                <td
                                  key={column}
                                  className="whitespace-nowrap px-4 py-3 text-xs text-zinc-300"
                                >
                                  {row[column] === null
                                    ? 'NULL'
                                    : row[column] === undefined
                                      ? '—'
                                      : String(row[column])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-5 text-xs text-zinc-500">
                      The query returned no columns.
                    </p>
                  )}

                  {queryResult.rows.length === 0 && (
                    <p className="border-t border-white/[0.06] p-5 text-xs text-zinc-500">
                      No records found for this query.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-7 border-t border-white/[0.08] pt-5">
                <p className="mb-3 text-[10px] font-semibold tracking-[1.5px] text-zinc-500">
                  TRY ASKING
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((item) => (
                    <button
                      key={item}
                      onClick={() => selectPrompt(item)}
                      className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-[11px] text-zinc-400 transition hover:border-indigo-400/30 hover:bg-indigo-400/[0.08] hover:text-indigo-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Database Overview */}
          <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Database overview
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Live information from your PostgreSQL database
                </p>
              </div>

              <span className="text-[10px] text-zinc-600">
                LIVE DATABASE
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Database tables',
                  value: schema ? String(tables.length) : '—',
                  icon: Database,
                  detail: 'Tables detected',
                },
                {
                  label: 'Database columns',
                  value: schema ? String(totalColumns) : '—',
                  icon: Table2,
                  detail: 'Across all tables',
                },
                {
                  label: 'Relationships',
                  value: schema ? String(totalRelationships) : '—',
                  icon: GitBranch,
                  detail: 'Foreign-key connections',
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:bg-white/[0.045]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300">
                        <Icon size={18} />
                      </div>
                      <ArrowUpRight
                        size={15}
                        className="text-zinc-700 transition group-hover:text-indigo-300"
                      />
                    </div>

                    <p className="mt-5 text-3xl font-semibold tracking-tight">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-zinc-300">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-600">
                      {item.detail}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Actual Database Tables */}
          <section className="mt-9">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-white">
                Database tables
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Tables and columns retrieved directly from PostgreSQL
              </p>
            </div>

            {apiStatus === 'checking' && (
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 text-xs text-zinc-400">
                <Loader2 size={15} className="animate-spin" />
                Loading database schema...
              </div>
            )}

            {schemaError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.05] p-4 text-xs text-red-300">
                <AlertCircle size={15} />
                {schemaError}
              </div>
            )}

            {schema && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {tables.map(([tableName, table]) => (
                  <div
                    key={tableName}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-indigo-300" />
                        <h3 className="text-sm font-semibold text-white">
                          {tableName}
                        </h3>
                      </div>

                      <span className="text-[10px] text-zinc-500">
                        {table.columns.length} columns
                      </span>
                    </div>

                    <div className="space-y-2">
                      {table.columns.map((column) => (
                        <div
                          key={column.name}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/[0.025] px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-300">
                              {column.name}
                            </span>

                            {table.primary_key.includes(column.name) && (
                              <span className="rounded bg-indigo-400/10 px-1.5 py-0.5 text-[9px] text-indigo-300">
                                PK
                              </span>
                            )}

                            {table.foreign_keys.some((fk) =>
                              fk.columns.includes(column.name),
                            ) && (
                              <span className="rounded bg-purple-400/10 px-1.5 py-0.5 text-[9px] text-purple-300">
                                FK
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-zinc-500">
                            {column.type}
                          </span>
                        </div>
                      ))}
                    </div>

                    {table.foreign_keys.length > 0 && (
                      <div className="mt-4 border-t border-white/[0.06] pt-3">
                        <p className="mb-2 text-[10px] font-semibold tracking-wider text-zinc-500">
                          RELATIONSHIPS
                        </p>

                        {table.foreign_keys.map((fk, index) => (
                          <p
                            key={`${tableName}-${index}`}
                            className="mb-1 flex items-center gap-2 text-[10px] text-zinc-400"
                          >
                            <GitBranch
                              size={12}
                              className="text-indigo-300"
                            />
                            {fk.columns.join(', ')} → {fk.references_table}.
                            {fk.references_columns.join(', ')}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Queries and Activity */}
          <section className="mt-9 grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Recent queries</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Sample workspace queries
                  </p>
                </div>
                <span className="text-[10px] text-zinc-500">PREVIEW</span>
              </div>

              <div className="space-y-2">
                {recentQueries.map((query) => (
                  <button
                    key={query.title}
                    onClick={() => selectPrompt(query.title)}
                    className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-white/[0.02] p-3 text-left transition hover:border-white/[0.08] hover:bg-white/[0.045]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-400/[0.08] text-indigo-300">
                      <Code2 size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-zinc-200">
                        {query.title}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-zinc-600">
                        {query.sql}
                      </p>
                    </div>

                    <span className="hidden text-[10px] text-zinc-500 sm:block">
                      {query.status}
                    </span>

                    <span className="hidden text-[10px] text-zinc-600 md:block">
                      {query.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="mb-5 flex items-center gap-2">
                <Activity size={16} className="text-indigo-300" />
                <h2 className="text-sm font-semibold">Workspace status</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-zinc-500" />
                    <span className="text-xs text-zinc-300">
                      Database connection
                    </span>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 text-[10px] ${
                      apiStatus === 'connected'
                        ? 'text-emerald-400'
                        : apiStatus === 'checking'
                          ? 'text-amber-400'
                          : 'text-red-400'
                    }`}
                  >
                    {apiStatus === 'connected' ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <CircleDot size={12} />
                    )}
                    {apiStatus === 'connected'
                      ? 'Connected'
                      : apiStatus === 'checking'
                        ? 'Checking'
                        : 'Disconnected'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-zinc-500" />
                    <span className="text-xs text-zinc-300">
                      AI generation API
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <CheckCircle2 size={12} />
                    Endpoint available
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock3 size={16} className="text-zinc-500" />
                    <span className="text-xs text-zinc-300">
                      Query history
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Not configured
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-indigo-400/10 bg-indigo-500/[0.06] p-4">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Sparkles size={15} />
                  <p className="text-xs font-semibold">IntelliSQL AI</p>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  Your PostgreSQL database is connected. Ask a question in
                  plain English to generate SQL and view your query results.
                </p>
              </div>
            </div>
          </section>

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] py-5">
            <p className="text-[10px] text-zinc-600">
              IntelliSQL · AI Database Studio
            </p>
            <p className="text-[10px] text-zinc-600">
              Built for intelligent data exploration
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App