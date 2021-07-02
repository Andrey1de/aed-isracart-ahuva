

export async function jsonGET$(url) {
    try {
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                }
            }
        );
        return response.json();
        
    } catch (error) {
        throw error;
    }
  
}
export async function jsonPOST$(url, body) {
    try {
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );
        return response.json();
        
    } catch (error) {
        throw error;
    }
  
}
export async function jsonDELETE$(url) {
    try {
        const response = await fetch(url,
            {
                method: "DELETE",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                }
            }
        );
        return response.json();
        
    } catch (error) {
        throw error;
    }
  
}