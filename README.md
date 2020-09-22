# New York Times Article Transcription Fixer

Fixes end-of-line hyphenation being misinterpreted as the space character in transcribed archived NY Times articles.

This is a very common issue that I've noticed in several prominent transcribed NY Times articles, particularly from the 1970s. You might see several words in an older transcribed article have spaces in the middle, like: 'Gover nment' instead of 'Government'. In fact, the issue is in several famous articles, including the article which began the NYT release of the Pentagon Papers, the NY Times article about Apollo 14, and more.

**For more information about this project and the algorithm used, check out the [official website and demo](https://nytimesfixer.now.sh).**

## Using the Program Yourself

If you'd just like to try out the program, check out the [Try It Yourself](https://nytimesfixer.now.sh/tryit.html) page on the official site.

If you'd like to manually use the program in a JavaScript or Node.js project, follow these instructions:

 1. **Clone or Download the GitHub repo:**

```
git clone https://github.com/xtrp/nytimes-fixer
```

 2. **Import or require the `fixArticle` index file**

To use the program, you'll be using the `fixArticle` function. To get access to this function, require the `fixArticle` index file like so:

```javascript
const fixArticle = require('./path/to/nytimes-fixer/src/fixArticle/');
```

 3. **Use the function to fix errors in articles**

The exported `fixArticle` function has the following format: **`fixArticle(articleText, [options])`**.

Paragraphs within article text should have **one empty line between each paragraph**, or `\n\n` after each paragraph.

The `options` argument is an object with the following properties which are all optional:

 - `delimiterFunction(currentErrorIndex)` (`Function`): if you'd like to add text or code before and after each fixed error, set this to a function that returns an object of the `{ start: '[start delimiter]', end: '[end delimiter]' }` format. The function also takes a single optional argument of the current error index. For example:

```javascript
const articleContent = "[...]"
fixArticle(articleContent, {
  delimiterFunction: (currentIndex) => {
    return {
      start: "[ this is the start of the error #" + (currentIndex + 1) + " ]",
      end: "[ this is the end of the error #" + (currentIndex + 1) + " ]"
    }
  }
});
```

If ```delimiterFunction``` is set to `'default'`, the default delimiter used on the official website will be used.

 - `async` (`boolean`): whether the function should run asynchronously or not. Commonly used with `paragraphCallback`.
 - `paragraphCallback(originalParagraph, fixedParagraph)` (`Function`): if specified, this function is called after the program has finished processing each paragraph. Typically used with `async`. The purpose of this is to increase speed when processing in real-time. If you are processing a very long article (ex: 30,000 words), results can take a while, and specifying a `paragraphCallback` will provide real-time results.

### Example Usage

Below is an example of how the program can be used to fix an article asynchronously with added delimiters.

```javascript
const fixArticle = require('./fixArticle');

fixArticle('article content here.....', {
  delimiterFunction: (errorIndex) => {
    return {
      start: "<<",
      end: ">>"
    } // errors will now look like: "Hello <<world>>!"
  },
  async: true, // function will not return anything
  paragraphCallback: (originalParagraphContent, fixedParagraphContent) => {
    console.log("Was: " + originalParagraphContent);
    console.log("Now: " + fixedParagraphContent);
  } // log paragraph content as it comes, not once all the paragraphs are finished being fixed
});
```

## Algorithm and Background

Can be found at the [about page on the official website](https://nytimesfixer.now.sh/about.html).

## Contributing

Feel free to add a pull request or submit an issue! I usually respond within a single business day.

## License and Credits

Example articles and excerpts from articles on the site are from the New York Times, and are used under Fair Use for educational and research purposes.

All code is written by [Gabriel Romualdo](https://xtrp.io), and is licensed under the MIT License. See `LICENSE.txt` for more information.
