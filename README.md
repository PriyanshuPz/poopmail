![Poopmail Banner](frontend/public/banner.png)

A temporary email service that allows users to create disposable email addresses and receive emails without registration.

Poopmail is live at https://mail.tsbin.tech

## Project Status

The main purpose of this project has been achieved - providing a free, privacy-focused temporary email service with core functionality complete and stable.

### Contributions Welcome

While this project is not on my active priority list, **contributors are welcome!** If you'd like to contribute improvements, bug fixes, or new features:

- Fork the repository
- Make your changes
- Submit a pull request

All contributions will be reviewed and merged by the admin as time permits. The project is not abandoned - just not actively developed by the maintainer.

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our community standards.

## License

This project is open source and available under the [MIT License](LICENSE).

# Setup

The UI part of the project is in `frontend` folder.

```bash
cd frontend
pnpm install
pnpm dev
```

The Cloudflare worker that is grab all the emails and send to ingester

```bash

cd cf-worker
npx wrangler deploy
```
