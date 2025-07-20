# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## WebGL Shader Fine-Tuning (lines 92-129):

  Mist Character:
  - Line 94: scaledUV = uv * 5.0 - Higher = finer detail, Lower = larger clouds
  - Line 115: smoothstep(0.3, 0.9, mist) - Adjust 0.3-0.9 range for density threshold
  - Line 128: mist * 0.3 - Overall opacity (0.1 = very subtle, 0.6 = dense)

  Flow Dynamics:
  - Line 97: time * 0.002 - Master speed control
  - Lines 100-101: Flow directions - experiment with negative values for reverse flow
  - Line 111: sin((uv.y + time) * 2.0) * 0.1 - Upward drift strength

  Visual Style:
  - Line 126: 0.4 + sin(time * 5.0) * 0.1 - Base gray + variation amount
  - Lines 108: Layer mixing ratios 0.5 + 0.3 + 0.2 - which noise layer dominates

## CSS Animation Coordination (vapor.css):

  Current Timing:
  - Above layer: 2s delay → 2s fade-in → 4s fade-out (starts at 4s)
  - Below layer: 4s delay → 3s fade-in → 4s fade-out (starts at 6s)

  Key Adjustments:
  - Delay times: When each layer becomes visible
  - Duration times: How fast the cross-fade happens
  - Easing functions: ease-in vs ease-out affects transition feel

  The WebGL creates the mist pattern, CSS controls when/how you see it. Perfect combination for fine-tuning!