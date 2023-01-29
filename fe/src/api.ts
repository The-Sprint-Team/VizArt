export const BASE_URL = "http://localhost:5000";

export type Id = string;
export interface VideoMeta {
  name: string;
  vid: string;
  thumb: string;
  time: Date;
}

const api = {
  /// Get the list of file ids and their name
  async listVideos(): Promise<Record<Id, VideoMeta>> {
    return await fetch(`${BASE_URL}/videos`, {
      method: "GET",
    })
      .then((r) => r.json())
      .then(
        (d) =>
          Object.fromEntries(
            Object.entries(d).map(([k, v]: [string, any]) => [
              k,
              { ...v, time: new Date(v.time) },
            ])
          ) as Record<Id, VideoMeta>
      );
  },

  /// Upload a file with the given name, returning the id.
  async uploadFile(name: string, data: Blob, thumb: string): Promise<number> {
    let form = new FormData();
    form.append("file", data);
    form.append("name", name);
    form.append("thumb", thumb);
    return await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((d) => d.uid as number);
  },
};
export default api;
