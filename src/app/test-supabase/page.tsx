import { createClient } from '@/lib/supabase/server'

export default async function TestSupabase() {
    const supabase = await createClient()

    // Try to fetch something simple, e.g. the user session or just checking if we can connect
    // Note: 'courses' might not exist, but valid connection will return a specific error or empty list
    // simpler is to check auth.
    const { data, error } = await supabase.auth.getUser()

    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

            <div className="space-y-4">
                <div className="p-4 border rounded bg-gray-50">
                    <h2 className="font-semibold mb-2">Connection Status</h2>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                        <p className="text-green-600">✅ Environment Variables Detected</p>
                    ) : (
                        <p className="text-red-600">❌ Environment Variables Missing</p>
                    )}
                </div>

                <div className="p-4 border rounded bg-gray-50">
                    <h2 className="font-semibold mb-2">Auth Check Result</h2>
                    <pre className="bg-slate-900 text-white p-4 rounded overflow-auto">
                        {JSON.stringify({ data, error }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}
