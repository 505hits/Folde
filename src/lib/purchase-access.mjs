export async function hasPaidAccess(session) {
 const response=await fetch('/api/wedding',{cache:'no-store',headers:{Authorization:`Bearer ${session.access_token}`}});
 if(!response.ok)throw new Error('Unable to verify your existing plan. Please try again.');
 const data=await response.json();
 return (data.orders || []).some(order=>order.paid && order.status!=='Cancelled');
}
