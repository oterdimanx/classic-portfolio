export const get_all_countries = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/common/country`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache' // Add caching
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch countries: ${res.status}`);
    }
    const result = await res.json();
    // Return the actual countries data, not the wrapper
    return result.data || [];

  } catch (error) {
    console.log('Error in getting all countries (service) =>', error)
  }
}
/**
 * expected static data
   export const get_all_countries = async () => {
   return [
     { name: "Test", flag: "🇺🇸", iso2: "US", dialCode: "+1" }
   ];
 };
 */