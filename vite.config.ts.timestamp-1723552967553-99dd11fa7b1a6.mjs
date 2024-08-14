// vite.config.ts
import { defineConfig } from "file:///home/lehs/Desktop/CPHC_Platform_FE_On_Prem/node_modules/vite/dist/node/index.js";
import react from "file:///home/lehs/Desktop/CPHC_Platform_FE_On_Prem/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { VitePWA } from "file:///home/lehs/Desktop/CPHC_Platform_FE_On_Prem/node_modules/vite-plugin-pwa/dist/index.js";
var manifestForPlugin = {
  registerType: "prompt",
  devOptions: {
    enabled: false
  },
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "eSwasthya Dham",
    short_name: "eSwasthya Dham",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/"
  },
  workbox: {
    additionalManifestEntries: [
      { url: "/Terms-and-conditions.htm", revision: "1" },
      { url: "/Iconic-Advisory.pdf", revision: "1" }
    ]
  }
};
var vite_config_default = defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9sZWhzL0Rlc2t0b3AvQ1BIQ19QbGF0Zm9ybV9GRV9Pbl9QcmVtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9sZWhzL0Rlc2t0b3AvQ1BIQ19QbGF0Zm9ybV9GRV9Pbl9QcmVtL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2xlaHMvRGVza3RvcC9DUEhDX1BsYXRmb3JtX0ZFX09uX1ByZW0vdml0ZS5jb25maWcudHNcIjsvKipcbiAqIFZpdGUgQ29uZmlndXJhdGlvblxuICogXG4gKiBUaGlzIGZpbGUgZGVmaW5lcyB0aGUgY29uZmlndXJhdGlvbiBmb3IgVml0ZSwgYSBidWlsZCB0b29sIHRoYXQgcHJvdmlkZXMgYSBmYXN0IGFuZCBlZmZpY2llbnQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnQuXG4gKiBUaGlzIGZpbGUgY29uZmlndXJlcyB0aGUgVml0ZSBQV0EgcGx1Z2luLCB3aGljaCBlbmFibGVzIFBXQSBmZWF0dXJlcyBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICogSXQgZGVmaW5lcyBob3cgdGhlIFBXQSBzaG91bGQgYmUgcmVnaXN0ZXJlZCwgYXNzZXRzIHRvIGluY2x1ZGUsIGFuZCB0aGUgd2ViIGFwcCBtYW5pZmVzdC5cbiAqL1xuXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xuaW1wb3J0IHsgVml0ZVBXQSwgVml0ZVBXQU9wdGlvbnMgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5cbmNvbnN0IG1hbmlmZXN0Rm9yUGx1Z2luOiBQYXJ0aWFsPFZpdGVQV0FPcHRpb25zPiA9IHtcbiAgICByZWdpc3RlclR5cGU6ICdwcm9tcHQnLFxuICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJywgJ21hc2tlZC1pY29uLnN2ZyddLFxuICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdlU3dhc3RoeWEgRGhhbScsXG4gICAgICAgIHNob3J0X25hbWU6ICdlU3dhc3RoeWEgRGhhbScsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3JjOiAncHdhLTY0eDY0LnBuZycsXG4gICAgICAgICAgICAgICAgc2l6ZXM6ICc2NHg2NCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzcmM6ICdtYXNrYWJsZS1pY29uLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgICAgIHB1cnBvc2U6ICdtYXNrYWJsZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgIH0sXG4gICAgd29ya2JveDoge1xuICAgICAgICBhZGRpdGlvbmFsTWFuaWZlc3RFbnRyaWVzOiBbXG4gICAgICAgICAgICB7IHVybDogJy9UZXJtcy1hbmQtY29uZGl0aW9ucy5odG0nLCByZXZpc2lvbjogJzEnIH0sXG4gICAgICAgICAgICB7IHVybDogJy9JY29uaWMtQWR2aXNvcnkucGRmJywgcmV2aXNpb246ICcxJyB9LFxuICAgICAgICBdLFxuICAgIH0sXG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBWaXRlUFdBKG1hbmlmZXN0Rm9yUGx1Z2luKV0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQVNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQStCO0FBRXhDLElBQU0sb0JBQTZDO0FBQUEsRUFDL0MsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLElBQ1IsU0FBUztBQUFBLEVBQ2I7QUFBQSxFQUNBLGVBQWUsQ0FBQyxlQUFlLHdCQUF3QixpQkFBaUI7QUFBQSxFQUN4RSxVQUFVO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUEsTUFDSDtBQUFBLFFBQ0ksS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDSSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxRQUNJLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0ksS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ2I7QUFBQSxJQUNKO0FBQUEsSUFDQSxhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsRUFDZjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsMkJBQTJCO0FBQUEsTUFDdkIsRUFBRSxLQUFLLDZCQUE2QixVQUFVLElBQUk7QUFBQSxNQUNsRCxFQUFFLEtBQUssd0JBQXdCLFVBQVUsSUFBSTtBQUFBLElBQ2pEO0FBQUEsRUFDSjtBQUNKO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sR0FBRyxRQUFRLGlCQUFpQixDQUFDO0FBQ2pELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
