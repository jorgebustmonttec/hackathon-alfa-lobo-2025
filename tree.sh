#!/bin/sh
# tree.sh

# This script displays the project structure, ignoring irrelevant directories.
# Make sure you have 'tree' installed.
# On macOS: brew install tree
# On Debian/Ubuntu: sudo apt-get install tree

echo "🌳 Project structure:"
tree -a -I 'node_modules|.expo|dist|web-build|.git|ios|android|.DS_Store|*.pem|data'
