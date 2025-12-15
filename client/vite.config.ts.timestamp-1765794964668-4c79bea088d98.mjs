// vite.config.ts
import { defineConfig } from "file:///mnt/c/WINDOWS/system32/_book_claude-code/week2/Wed/cafe_reservation_service/client/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/WINDOWS/system32/_book_claude-code/week2/Wed/cafe_reservation_service/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/mnt/c/WINDOWS/system32/_book_claude-code/week2/Wed/cafe_reservation_service/client";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@/components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@/pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@/hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@/stores": path.resolve(__vite_injected_original_dirname, "./src/stores"),
      "@/services": path.resolve(__vite_injected_original_dirname, "./src/services"),
      "@/utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@/types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@/constants": path.resolve(__vite_injected_original_dirname, "./src/constants"),
      "@/shared": path.resolve(__vite_injected_original_dirname, "../shared/src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3e3,
    fs: {
      allow: [".."]
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3005",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvV0lORE9XUy9zeXN0ZW0zMi9fYm9va19jbGF1ZGUtY29kZS93ZWVrMi9XZWQvY2FmZV9yZXNlcnZhdGlvbl9zZXJ2aWNlL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1dJTkRPV1Mvc3lzdGVtMzIvX2Jvb2tfY2xhdWRlLWNvZGUvd2VlazIvV2VkL2NhZmVfcmVzZXJ2YXRpb25fc2VydmljZS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1dJTkRPV1Mvc3lzdGVtMzIvX2Jvb2tfY2xhdWRlLWNvZGUvd2VlazIvV2VkL2NhZmVfcmVzZXJ2YXRpb25fc2VydmljZS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0AvY29tcG9uZW50cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXG4gICAgICAnQC9wYWdlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wYWdlcycpLFxuICAgICAgJ0AvaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaG9va3MnKSxcbiAgICAgICdAL3N0b3Jlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdG9yZXMnKSxcbiAgICAgICdAL3NlcnZpY2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3NlcnZpY2VzJyksXG4gICAgICAnQC91dGlscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxuICAgICAgJ0AvdHlwZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcbiAgICAgICdAL2NvbnN0YW50cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb25zdGFudHMnKSxcbiAgICAgICdAL3NoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zaGFyZWQvc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbJy4uJ10sXG4gICAgfSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwNScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICByb3V0ZXI6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIHVpOiBbJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyYSxTQUFTLG9CQUFvQjtBQUN4YyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsZ0JBQWdCLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUMxRCxXQUFXLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDaEQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQ2hELFlBQVksS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNsRCxjQUFjLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxNQUN0RCxXQUFXLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDaEQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQ2hELGVBQWUsS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLE1BQ3hELFlBQVksS0FBSyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxJQUNyRDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNGLE9BQU8sQ0FBQyxJQUFJO0FBQUEsSUFDZDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixJQUFJLENBQUMsMEJBQTBCLCtCQUErQjtBQUFBLFFBQ2hFO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
