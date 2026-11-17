// The dashboard retrieves the result from KIE. Acknowledge delivery without
// parsing or recording untrusted callback bodies.
export async function POST() {
  return Response.json({ received: true });
}
