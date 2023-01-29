const URL_BASE = "http://localhost:5000";

const api = {
  /// Get the list of file ids and their name
  async getFiles(): Promise<Record<string, string>> {
    return await fetch(`${URL_BASE}/files`, {
      method: "GET",
    })
      .then((r) => r.json())
      .then((d) => d.data as Record<string, string>);
  },

  /// Upload a file with the given name, returning the id.
  async uploadFile(name: string, data: Blob): Promise<number> {
    let form = new FormData();
    form.append("file", data);
    form.append("name", name);
    return await fetch(`${URL_BASE}/upload`, {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((d) => d.uid as number);
  },
};
export default api;
