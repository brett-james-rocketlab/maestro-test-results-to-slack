export function safeTestUnits(item: any): boolean {
    // Check that there is none, even if it doesn't exist
    const itemCount = parseInt(item) || 0

    return (
        itemCount === 0 ? true : false
    );
  }

  

  