export async function share(url: string) {
  if (typeof navigator.share !== "undefined") {
    await navigator.share({
      url: url,
    });
  } else if (typeof navigator.clipboard.writeText !== "undefined") {
    await navigator.clipboard.writeText(
      url,
    );
    alert("Link copied to clipboard");
  }
}
