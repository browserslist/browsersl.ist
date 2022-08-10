# Browserslist Website

This website uses [Browserslist] and [Can I Use] to display
the compatible browsers for a browsers query.

[browserslist]: https://github.com/browserslist/browserslist
[Can I Use]: https://github.com/Fyrd/caniuse


## Development
Can I Use
To run a local copy for development:

1. Install correct versions of Node.js and pnpm. There are two ways:
	- With [`asdf`](https://github.com/asdf-vm/asdf) version manager:

      ```sh
      asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
      asdf plugin-add pnpm https://github.com/jonathanmorley/asdf-pnpm.git
      asdf install
      ```

	- Manually by check versions in `.tool-versions`.

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Run local server:

   -  Server with client-side hot-reload
      ```sh
      pnpm start
      ```

   -  Server production mode
      ```
      pnpm production
      ```

We recommend to install Prettier and EditorConfig plugins to your text editor.
