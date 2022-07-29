# Browserslist Website

This website uses [Browserslist] and [Can I Use] to display
the compatible browsers for a browsers query.

[browserslist]: https://github.com/browserslist/browserslist
[Can I Use]: https://github.com/Fyrd/caniuse


## Development
Can I Use
To run a local copy for development:

1. Install correct versions of Node.js and pnpm. There are two ways:
	- With `asdf` version manager:
		1. Install [`asdf`](https://github.com/asdf-vm/asdf).
		2. Install plugins for Node.js and pnpm:

       ```sh
       asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
       asdf plugin-add pnpm https://github.com/jonathanmorley/asdf-pnpm.git
       ```

		3. Run `asdf install`
	- Manually (check needed versions in `.tool-versions`)

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Run local server:

   ```sh
   pnpm start
   ```

We recommend to install Prettier and EditorConfig plugins to your text editor.
