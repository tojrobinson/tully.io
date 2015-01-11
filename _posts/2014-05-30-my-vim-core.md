---
title: My Vim Core
category: programming
author: Tully Robinson
layout: post
---
It's been a while since I've noticed a new Vim command work its way into my core set, so I figured it would be interesting to do some reflection and see where I had arrived after years of Vim use. I wanted to see which commands had become part of my procedural memory and which had been left behind, being more novel than useful.

Over the last week or so, I monitored my usage (just manually, although if you're interested: `vim -W ./vim.log`) to see which commands I naturally reached for in order to get things done. Certainly, I'm aware of more commands; however and for whatever reason, when just focussing on the task at hand, it didn't seem like I relied on more than these.

For the sake of brevity, I have omitted some of the basics that you can't really avoid and which would be a part of anybody's working set. Unless, of course, you're @iamdeveloper:

<blockquote class="twitter-tweet" align="center" lang="en"><p>I&#39;ve been using Vim for about 2 years now, mostly because I can&#39;t figure out how to exit it.</p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/statuses/435555976687923200">February 17, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

##Moving Around
<kbd>5</kbd> <kbd>j</kbd> - Move down five lines. While this is in the 'Moving Around' section, the command quantifier could be a section unto itself. Typing a number before a command has the effect of repeating the subsequent command `n` times which can be incredibly useful. I use it with the movement, deletion and, formatting commands quite often.

<kbd>g</kbd> <kbd>g</kbd> - Move cursor to the top of the document.

<kbd>Shift</kbd> + <kbd>g</kbd> - Move cursor to the bottom of the document.

<kbd>w</kbd> - Move cursor forward one word.

<kbd>b</kbd> - Move cursor backward one word.

<kbd>$</kbd> - Move cursor to end of line.

<kbd>0</kbd> - Move cursor to start of line.

<kbd>^</kbd> - Move cursor to start of text.

<kbd>:</kbd> <kbd>4</kbd> <kbd>2</kbd> - Jump to the 42nd line. I use this to jump to an approximate section of the document often.

<kbd>m</kbd> <kbd>k</kbd> - Mark a point in the document with label 'k'. Pressing <kbd>\`</kbd> (backtick ) <kbd>k</kbd> will jump back to this point.

<kbd>%</kbd> - Jump to match. This is useful when trying to find the opening and closing braces of large functions that might not fit in a single view or those deeply nested callback functions. You simply place the cursor over the opening or closing brace that you wish to match and hit <kbd>%</kbd> to jump to the partnering brace. This can also be done with parenthesis, square brackets, etc.

<kbd>/</kbd>\<searchTerm\> - Search document. After hitting enter, the first search match will be highlighted and the cursor will be at the start of it. From here you can jump to the next match with <kbd>n</kbd> or to the previous match with <kbd>Shift</kbd> + <kbd>n</kbd>. Other than the obvious use case, I use search to jump to a location on the screen that I can see by typing the first few characters of where I want to go; it's sometimes quicker than using the basic movement commands

##Inserting
You are constantly jumping in and out of insert mode when using Vim, as such, commands combining movement and insertion characteristics are extremely useful and get a lot of use.

<kbd>Shift</kbd> + <kbd>a</kbd> - Insert at end of current line.

<kbd>Shift</kbd> + <kbd>i</kbd> - Insert at start of current line.

<kbd>o</kbd> - Insert below current line.

<kbd>Shift</kbd> + <kbd>o</kbd> - Insert above current line.

##Selection
<kbd>Shift</kbd> + <kbd>v</kbd> - Start selecting lines. Use the Vim arrow keys to select more lines. I use this for relocating chunks of the document by following the selection with <kbd>d</kbd> (delete) and then a <kbd>p</kbd> (put) wherever I want it to go.

<kbd>Ctrl</kbd> + <kbd>v</kbd> - Start rectangular selection. Use the Vim arrows to select the area. With a more fine grained selection such as this, I typically use it to copy sections of a line.

##Undo/Redo

<kbd>u</kbd> - Undo last edit.

<kbd>Ctrl</kbd> + <kbd>r</kbd> - Restore last undone edit.

##Cut/Copy
<kbd>d</kbd> <kbd>d</kbd> - Delete line. A repercussion of any vim deletion is that the deleted content is buffered. I tend to use this as my copy line command (instead of <kbd>y</kbd> <kbd>y</kbd>) as well by deleting then undoing (<kbd>d</kbd> <kbd>d</kbd> <kbd>u</kbd>) as I like the visual cue of the line disappearing and then reappearing, indicating that the line was in fact copied. This is just personal preference, however.

<kbd>p</kbd> - Paste/put buffer.

<kbd>Shift</kbd> + <kbd>d</kbd> - Delete everything from this point until the end of the line.

<kbd>d</kbd> <kbd>w</kbd> - Delete next word.

<kbd>d</kbd> <kbd>i</kbd> <kbd>{</kbd> - Delete everything between braces. This can be used for various enclosing characters: ' " ] ).

<kbd>d</kbd> <kbd>i</kbd> <kbd>t</kbd> - Delete everything within a HTML tag.

<kbd>r</kbd> <kbd>z</kbd> - Replace character under cursor with 'z'.

<kbd>x</kbd> - Delete character.

<kbd>x</kbd> <kbd>p</kbd> - Switch order of two characters.

##Formatting
<kbd>=</kbd> <kbd>{</kbd> - Indent code contained in current { } block.

<kbd>g</kbd> <kbd>g</kbd> <kbd>=</kbd> <kbd>G</kbd> - Indent the entire document.

<kbd>></kbd> <kbd>></kbd> - Shift line one indent right. The shift left/right commands are useful with the line selection in order to select a large block and then shift it all at once.

<kbd><</kbd> <kbd><</kbd> - Shift line one indent left.

## Prepend to Multiple Lines
I use this quite often to comment out blocks of code in languages where a `/* multi-line comment */` isn't available; such is the case with many scripting languages. Starting with the cursor at the beginning of the first line you intend to comment out:

1. <kbd>Ctrl</kbd> + <kbd>v</kbd>
2. Move the cursor down (or up) as many lines as you wish to comment out.
3. <kbd>Shift</kbd> + <kbd>i</kbd>
4. Type the character/s you wish to insert before each line, e.g., '#'.
5. Exit insert mode (<kbd>Esc</kbd> or <kbd>Ctrl</kbd> + <kbd>[</kbd> or <kbd>Ctrl</kbd> + <kbd>c</kbd>).

Whatever you typed should now be inserted before each of the selected lines.

##Command Line Mode
`:vsplit <document>` - Split screen vertically with another document. Once the screen has been split, you can then jump between the two by typing <kbd>Ctrl</kbd> + <kbd>w</kbd> and then <kbd>h</kbd> for the document on the left, or <kbd>l</kbd> for the document on the right; <kbd>Shift</kbd> + <kbd>h</kbd> or <kbd>Shift</kbd> + <kbd>l</kbd> will switch the position of the documents. You can also split the screen horizontally with `:split <document>`; however, I tend to prefer the vertical partition.

`:%s/foo/bar/g` - Replace all instances of 'foo' with 'bar'.

`:%s/foo/bar/gc` - Replace all instances of 'foo' with 'bar' with prompt before substituting.

`:!<command>` - Escape to shell and run command.

`:r!<command>` - Same as above, except this time the output from the command will appear inside the current document.

`:r <file>` - Read contents of file into current document.

`:earlier 10m` - Remove all edits made in the last 10 minutes.

`:later 10m` - Restore all edits made in the last 10 minutes.

`:help` - Vim documentation. You can get specific information on any of the commands by running `:help <cmd>`.

##Random Goodies
I said I would just be outlining my core set of commands, so consider these as an aside.

`:TOhtml` - Generate an HTML representation of the current document.

`:hardcopy` - Print the document with the default printer.

`:%!hd` - Edit document as hexdump.

`:help 42`- Vim easter egg.

Well, there it is... These would account for around 90-95% of my activity in the Vim editor and haven't really changed or grown in about a year or so now. Perhaps I'm experiencing the zero gradient edge of the Vi learning curve:

<img src="http://mrozekma.com/editor-learning-curve.png" style="display:block; margin: 0 auto;" />

That, or I'm just not spamming the cheat sheets like I used to.
