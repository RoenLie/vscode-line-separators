<!--[![](https://vsmarketplacebadge.apphb.com/version-short/alefragnani.separators.svg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.separators)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/alefragnani.separators.svg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.separators)
[![](https://vsmarketplacebadge.apphb.com/rating-short/alefragnani.separators.svg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.separators)
[![](https://img.shields.io/github/workflow/status/alefragnani/vscode-separators/CI)](https://github.com/alefragnani/vscode-separators/actions?query=workflow%3ACI)-->

<!--<p align="center">
  <br />
  <a title="Learn more about Line Separators" href="http://github.com/roenlie/vscode-line-separators"><img src="https://raw.githubusercontent.com/roenlie/vscode-line-separators/master/images/vscode-separators-logo-readme.png" alt="Separators Logo" width="70%" /></a>
</p>-->

# Separators

This is a modified version of Separators by Alessandro Fragnani.
Please see https://marketplace.visualstudio.com/items?itemName=alefragnani.separators if you prefer using the original work.

_differences_  
This modified version adds support for variables, as well as making the line seperators dynamically try to stay 1 line above where the symbol
is located.
If the lines are next to eachother, the seperator will be hidden.

<hr>

This extension improves the readability of your source code, by drawing lines on top of each symbol.

![Print](images/vscode-separators-print-readme.png)

Here are some of the features that **Separators** provides:

- Customize the separators appearance
- Each kind of symbol can have its own customization
- Select which symbols will have separators

## Language Support

The extension will automatically work with any language you have installed in VS Code. The only requirement is that the language itself does support `Go to Symbol`.

To be sure your desired language will work on Separators, take a look at `Outline` view in VS Code. If it display contents, then Separators will work perfectly.

# Features

## Available commands

- `Separators: Toggle Visibility`
- `Separators: Select Symbols`

## Available settings

You can customize the appearance of each kind of Symbol.

- List of symbols in which the separators will be drawn

  ```json
  // globally (user/workspace setting)
  "separators.enabledSymbols": [
  	"Classes",
  	"Constructors",
  	"Enums",
  	"Functions",
  	"Interfaces",
  	"Methods",
  	"Namespaces",
  	"Structs",
  	"Variables"
  ],

  // per-language setting
  "[typescript]": {
      "separators.enabledSymbols": [
          "Enums",
          "Interfaces"
      ],
  }
  ```

- Controls whether callback/inline Functions should be ignored _(default is `false`)_

  ````json
  // globally (user/workspace setting)
  "separators.functions.ignoreCallbackInline": true

      // per-language setting
      "[javascript]": {
          "separators.functions.ignoreCallbackInline": true
      }
      ```

  > For now, only **JavaScript**, **TypeScript** and **Lua** languages are supported. If you would like to see it on other languages, please open an issue providing details/samples

  ````

- Indicates the maximum depth (level) which the separators should be rendered _(default is `0`)_

  ```json
  "separators.maxDepth": 1

  // per-language setting
  "[javascript]": {
      "separators.maxDepth": 2
  }
  ```

- Defines the border width _(in `px`)_

  ```json
  "separators.classes.borderWidth": 1,
  "separators.constructors.borderWidth": 1,
  "separators.enums.borderWidth": 1,
  "separators.functions.borderWidth": 1,
  "separators.interfaces.borderWidth": 1,
  "separators.methods.borderWidth": 1,
  "separators.namespaces.borderWidth": 1,
  "separators.structs.borderWidth": 1,
  "separators.variables.borderWidth": 1,
  ```

- Define how border style _(choose between `solid`, `dotted`, `dashed` or `double`)_
  ```json
  "separators.classes.borderStyle": "solid",
  "separators.constructors.borderStyle": "solid",
  "separators.enums.borderStyle": "solid",
  "separators.functions.borderStyle": "solid",
  "separators.interfaces.borderStyle": "solid",
  "separators.methods.borderStyle": "solid",
  "separators.namespaces.borderStyle": "solid",
  "separators.structs.borderStyle": "solid",
  "separators.variables.borderStyle": "solid",
  ```

> Starting in v2.0 the separators for each symbol kind will use the corresponding `symbolIcon` color as new default. If you want `Methods`, `Functions` and `Constructors` to keep using the original _greenish_ color (`#65EAB9`) from v1.0, update the new `separators.useOriginalGreenishSeparator` setting to `true`.

## Available colors

For more information about customizing colors in VSCode, see [Theme Color](https://code.visualstudio.com/api/references/theme-color).

- Choose the color of the border

```json
    "workbench.colorCustomizations": {
      "separators.classes.borderColor": "#65EAB9",
      "separators.constructors.borderColor": "#65EAB9",
      "separators.enums.borderColor": "#65EAB9",
      "separators.functions.borderColor": "#65EAB9",
      "separators.interfaces.borderColor": "#65EAB9",
      "separators.methods.borderColor": "#65EAB9",
      "separators.namespaces.borderColor": "#65EAB9",
      "separators.structs.borderColor": "#65EAB9",
      "separators.variables.borderColor": "#65EAB9",
    }
```

# License

[GPL-3.0](LICENSE.md) &copy; Alessandro Fragnani
[GPL-3.0](LICENSE.md) &copy; Kristoffer Roen-Lie
