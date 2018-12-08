#!/usr/bin/env python3
import os
import re
import sys

word_regex = re.compile('[^a-zA-Z]')


def ffind(haystack, needle, start = None):
    idx = haystack.find(needle, start)
    if idx == -1:
        raise Exception("No \"" + needle + "\" found in " + haystack)
    return idx


def strip_tags(html):
    out = ""
    skipping = False
    for c in html:
        if c != '<' and c != '>' and not skipping:
            out += c

        if c == '<':
            skipping = True
        elif c == '>':
            skipping = False
    return out


def clip(html):
    all_posts_marker = 'all posts</a></div>'
    all_posts_index = ffind(html, all_posts_marker)

    footer_marker = '<div class="footer">'
    footer_index = ffind(html, footer_marker, all_posts_index)

    body = html[all_posts_index + len(all_posts_marker):footer_index]
    return body


def count_words(text):
    result = {}
    split = text.split()
    for word in split:
        subbed = word_regex.sub('', word.strip()).lower()
        if subbed == "":
            continue

        if subbed in result:
            result[subbed] += 1
        else:
            result[subbed] = 1

    return result


def sort_by_values(d):
    return [(k, d[k]) for k in sorted(d, key=d.get, reverse=True)]


def counts_to_str(d):
    result = ""
    for (k, v) in d:
        result = result + k + ': ' + str(v) + '\n'
    return result


def extract_title(html):
    title_tag = '<title>'
    title_index = ffind(html, title_tag)
    end_title_index = ffind(html, '</title>', title_index)

    return html[title_index + len(title_tag):end_title_index].replace('| Factorio', '').strip()


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Invalid number of arguments, requires <infile> and <outfile>")
        exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    if not os.path.isfile(infile):
        print("Input file " + infile + " is not a readable file")
        exit(1)

    os.makedirs(os.path.dirname(outfile), exist_ok=True)

    with open(infile, 'r') as infile_handle:
        data = infile_handle.read()

    title = extract_title(data)
    out = counts_to_str(sort_by_values(count_words(strip_tags(clip(data)).strip())))

    with open(outfile, 'w') as outfile_handle:
        outfile_handle.write("#title: " + title + "\n\n")
        outfile_handle.write(out)
