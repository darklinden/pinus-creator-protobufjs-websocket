#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib
import os
import argparse
import shutil


def file_md5(path: str) -> str:
    with open(path, "rb") as f:
        file_hash = hashlib.md5()
        while chunk := f.read(8192):
            file_hash.update(chunk)

    # print(file_hash.digest())
    return file_hash.hexdigest()  # to get a printable str instead of bytes


def mkdir_p(path):
    if path is None or len(path) == 0:
        return

    if not os.path.isdir(path):
        print("make dir: " + path)
        os.makedirs(path, exist_ok=True)


def file_equal(a: str, b: str, size_check_only: bool = False) -> bool:

    if os.path.isfile(a) != os.path.isfile(b):
        return False

    if os.stat(a).st_size != os.stat(b).st_size:
        return False

    if size_check_only:
        return True

    return file_md5(a) == file_md5(b)


def copy_file(folder_src: str, folder_des: str, size_check_only: bool = False, extensions: list = None, quiet: bool = False):
    relative_des_files = []
    for root, dirs, files in os.walk(folder_des):
        for fn in files:
            fpath = os.path.join(root, fn)
            if fpath.endswith('.DS_Store'):
                continue
            if os.path.isfile(fpath):
                fextension = fn[fn.rfind('.') + 1:]
                if (extensions is None) or fextension in extensions:
                    relative_path = fpath[len(folder_des) + 1:]
                    relative_des_files.append(relative_path)

    relative_files = []
    for root, dirs, files in os.walk(folder_src):
        for fn in files:
            fpath = os.path.join(root, fn)
            if fpath.endswith('.DS_Store'):
                continue
            if os.path.isfile(fpath):
                fextension = fn[fn.rfind('.') + 1:]
                if (extensions is None) or fextension in extensions:
                    relative_path = fpath[len(folder_src) + 1:]
                    relative_files.append(relative_path)

    for relative_path in relative_files:
        src_path = os.path.join(folder_src, relative_path)
        des_path = os.path.join(folder_des, relative_path)
        if file_equal(src_path, des_path, size_check_only):
            if relative_path in relative_des_files:
                relative_des_files.remove(relative_path)
            print('check passed: ' + src_path + ' -> ' + des_path)
            continue

        print('confirm copy: ' + src_path + ' -> ' + des_path)
        do = ''
        if not quiet:
            print('return to continue, n to skip, A yes to all')
            do = input()

            if do is not None and do.strip().startswith('A'):
                quiet = True

        if quiet or (not do.strip().startswith('n')):
            if relative_path in relative_des_files:
                relative_des_files.remove(relative_path)

            mkdir_p(os.path.dirname(des_path))
            if os.path.isfile(des_path):
                os.remove(des_path)
            shutil.copy(src_path, des_path)

    if len(relative_des_files) > 0:
        print('files in des folder not in src folder:')
        for p in relative_des_files:
            p = os.path.join(folder_des, p)
            print('\t' + p)


def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--from_path", type=str,
                        help="path from")
    parser.add_argument("-t", "--to_path", type=str,
                        help="path to")
    parser.add_argument("-e", "--extension", type=str, nargs='*',
                        help="with extensions")
    parser.add_argument("-q", "--quiet",  action='store_true',
                        help="without ask")
    parser.add_argument("-s", "--size_check_only",  action='store_true', default=False,
                        help="without check file md5")
    args = parser.parse_args()

    if (args.from_path is None) or (args.to_path is None):
        parser.print_help()
        return

    folder_src = args.from_path
    if not os.path.isdir(folder_src):
        folder_src = os.path.join(os.getcwd(), folder_src)

    folder_des = args.to_path
    if not os.path.isdir(folder_des):
        folder_des = os.path.join(os.getcwd(), folder_des)

    extensions = args.extension
    quiet = args.quiet

    copy_file(folder_src, folder_des, args.size_check_only, extensions, quiet)

    print('Done')


if __name__ == '__main__':
    main()
