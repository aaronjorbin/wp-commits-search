# WordPress Core Commits Search

A fast, client-side search interface for WordPress Core commits. This allows you to search through the commit history of WordPress Core, with features like full-text search, file filtering, and commit details.

## Features

- 🔍 Full-text search across commit messages, authors, and files
- 📄 File-level changes visibility for each commit
- 🔗 Direct links to WordPress Trac for commits and tickets
- 📱 Responsive design that works on all devices
- ⚡ Client-side search powered by [FlexSearch](https://github.com/nextapps-de/flexsearch)
- 🔄 Auto-updating commit data (refreshed hourly)
- 🎯 URL-based search parameters for easy sharing

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Updates

The commit data is automatically updated every hour through a GitHub Action that fetches the latest commits from WordPress Core's SVN repository. The data is stored in `commits.json` and is included in the build.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Licensed under the GNU General Public License v3.0 or later. See the LICENSE file for details.

## Author

Made with ❤️ by [Aaron Jorbin](https://aaron.jorb.in)
