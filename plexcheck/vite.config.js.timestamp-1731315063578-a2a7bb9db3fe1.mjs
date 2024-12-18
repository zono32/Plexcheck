// vite.config.js
import { fileURLToPath, URL } from "node:url";
import Components from "file:///C:/Users/joaquin.lafuenteespi/OneDrive%20-%20Plexus%20Tech/Escritorio/Kinso/plexhub/Vue/plexcheck/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///C:/Users/joaquin.lafuenteespi/OneDrive%20-%20Plexus%20Tech/Escritorio/Kinso/plexhub/Vue/plexcheck/node_modules/unplugin-auto-import/dist/vite.js";
import { defineConfig } from "file:///C:/Users/joaquin.lafuenteespi/OneDrive%20-%20Plexus%20Tech/Escritorio/Kinso/plexhub/Vue/plexcheck/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/joaquin.lafuenteespi/OneDrive%20-%20Plexus%20Tech/Escritorio/Kinso/plexhub/Vue/plexcheck/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/joaquin.lafuenteespi/OneDrive%20-%20Plexus%20Tech/Escritorio/Kinso/plexhub/Vue/plexcheck/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["src/components"],
      extensions: ["vue"]
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/
      ],
      imports: [
        "vue",
        "vue-router"
      ],
      dirs: [
        //'./hooks', //import useApi from "@/hooks/useApi";
      ],
      viteOptimizeDeps: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqb2FxdWluLmxhZnVlbnRlZXNwaVxcXFxPbmVEcml2ZSAtIFBsZXh1cyBUZWNoXFxcXEVzY3JpdG9yaW9cXFxcS2luc29cXFxccGxleGh1YlxcXFxWdWVcXFxccGxleGNoZWNrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqb2FxdWluLmxhZnVlbnRlZXNwaVxcXFxPbmVEcml2ZSAtIFBsZXh1cyBUZWNoXFxcXEVzY3JpdG9yaW9cXFxcS2luc29cXFxccGxleGh1YlxcXFxWdWVcXFxccGxleGNoZWNrXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9qb2FxdWluLmxhZnVlbnRlZXNwaS9PbmVEcml2ZSUyMC0lMjBQbGV4dXMlMjBUZWNoL0VzY3JpdG9yaW8vS2luc28vcGxleGh1Yi9WdWUvcGxleGNoZWNrL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxuICAgIH0pLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAvXFwuW3RqXXN4PyQvLFxuICAgICAgICAvXFwudnVlJC8sXG4gICAgICAgIC9cXC52dWVcXD92dWUvLCBcbiAgICAgICAgL1xcLm1kJC8sIFxuICAgICAgXSxcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgIF0sXG4gICAgICBkaXJzOiBbXG4gICAgICAgIC8vJy4vaG9va3MnLCAvL2ltcG9ydCB1c2VBcGkgZnJvbSBcIkAvaG9va3MvdXNlQXBpXCI7XG4gICAgICBdLFxuICAgICAgdml0ZU9wdGltaXplRGVwczogdHJ1ZSxcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMmQsU0FBUyxlQUFlLFdBQVc7QUFDOWYsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFFdkIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBTCtSLElBQU0sMkNBQTJDO0FBT2hXLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULE1BQU0sQ0FBQyxnQkFBZ0I7QUFBQSxNQUN2QixZQUFZLENBQUMsS0FBSztBQUFBLElBQ3BCLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTTtBQUFBO0FBQUEsTUFFTjtBQUFBLE1BQ0Esa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
