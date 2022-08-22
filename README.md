# Browserslist Website

<img width="120" height="120" alt="Browserslist logo by Anton Popov"
     src="https://browsersl.ist/logo.svg" align="right">

This website uses [Browserslist] and [Can I Use] to display
the compatible browsers for a browsers query.

**[browsersl.ist](https://browsersl.ist/)**

[browserslist]: https://github.com/browserslist/browserslist
[Can I Use]: https://github.com/Fyrd/caniuse


## HTTP API

You can use the site API in your own applications.

```
https://browsersl.ist/api/browsers?q=defaults&region=alt-ww
```

- `q` — query. Examples are available [on the website](https://browsersl.ist) or in the [browserslist repository](https://github.com/browserslist/browserslist#full-list). `defaults` by default.
- `region` — region code. List of all region codes can be found at [caniuse-lite/data/regions](https://github.com/browserslist/caniuse-lite/tree/main/data/regions). `alt-ww` by default.


### Response example

```js
// https://browsersl.ist/api/browsers?q=>defaults+and+supports+es6-module&region=alt-as

{
  "query": ">0.3%",
  "lint": [
    {
      "id": "countryWasIgnored",
      "message": "Less than 80% coverage in `China`, `Nigeria`, `Tanzania`, `Ghana`, and `Uganda` regions"
    }
  ],
  "region": "alt-as",
  "coverage": 88.44,
  "versions": {
    "browserslist": "4.21.3",
    "caniuse": "1.0.30001381"
  },
  "browsers": [
    {
      "id": "chrome",
      "name": "Chrome",
      "coverage": 17.06,
      "versions": {
        "102": 0.72,
        "103": 16.32
      }
    }
    ...
  ]
}
```

### Errors

If you send a request with an error, you will receive error message with the status 400.

```js
// https://browsersl.ist/api/browsers?q=>0%&region=XX

{
  "message": "Unknown region name `XX`."
}
```


## Development

We recommend to install Prettier and EditorConfig plugins to your text editor.

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

3. Run local server  with client-side watcher.

   ```sh
   pnpm start
   ```

To run local server in production mode:

```sh
pnpm ssdeploy run
```
