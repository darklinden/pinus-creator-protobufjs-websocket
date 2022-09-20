#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import shutil

from cprelative import copy_file


def gen_proto(folder: str):
    files = []
    folders = []
    for root, _, file in os.walk(folder):
        for f in file:
            if f.endswith('.cs'):
                os.remove(os.path.join(root, f))
                continue
            if not f.endswith('.proto'):
                continue
            if root not in folders:
                folders.append(root)
            files.append(os.path.join(root, f))

    include = ''
    for p in folders:
        include += '-I' + p + ' '

    for p in files:
        command = './protoc ' + include + \
            ' --csharp_out=' + os.path.dirname(p) + ' ' + p
        print(command)
        os.system(command)


def deal_with_proto(local_path: str):
    local_proto = local_path + '/proto'

    # clean
    shutil.rmtree(local_proto, ignore_errors=True)

    # clone proto
    project_path = os.path.dirname(local_path)
    origin_proto = os.path.dirname(project_path) + '/proto-structs/proto'

    # copy proto
    copy_file(origin_proto, local_proto,
              size_check_only=False, extensions=['proto'], quiet=True)

    # gen proto
    gen_proto(local_proto)

    # copy cs
    script_proto = os.path.dirname(local_path) + '/Assets/Plugins/Proto'
    copy_file(local_proto, script_proto,
              size_check_only=False, extensions=['cs'], quiet=True)

    # clean
    shutil.rmtree(local_proto, ignore_errors=True)


def gen_route(folder: str):
    os.remove(folder + '/index.ts')
    os.remove(folder + '/Cmd.ts')
    os.remove(folder + '/Structs.ts')
    os.remove(folder + '/RouteBase.ts')

    for root, _, file in os.walk(folder):
        for f in file:
            if not f.endswith('.ts'):
                continue
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
                content = content.replace(
                    'export default class', 'public class')
                content = content.replace('export class', 'public class')
                content = content.replace('extends', ':')
                content = content.replace("'", '"')
                content = re.sub(r'import .*', '', content)
                content = re.sub(r'public (\w+): Cmd = Cmd.create',
                                 r'public Cmd \1 = new Cmd', content)
                content = re.sub(r'proto.(\w+)',
                                 r'typeof(Proto.\1)', content)

            content = "\n".join([ll.rstrip()
                                for ll in content.splitlines() if ll.strip()])

            fp = fp[:fp.rfind('.')] + '.cs'
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)


def deal_with_route(local_path: str):

    local_route = local_path + '/route'

    # clean
    shutil.rmtree(local_route, ignore_errors=True)

    # clone route
    project_path = os.path.dirname(local_path)
    origin_route = os.path.dirname(project_path) + '/struct-routes/src'

    # copy route
    copy_file(origin_route, local_route,
              size_check_only=False, extensions=['ts'], quiet=True)

    # gen route
    gen_route(local_route)

    # copy cs
    script_route = os.path.dirname(local_path) + '/Assets/Plugins/Route'
    copy_file(local_route, script_route,
              size_check_only=False, extensions=['cs'], quiet=True)

    # clean
    shutil.rmtree(local_route, ignore_errors=True)


def main():
    local_path = os.getcwd()

    deal_with_proto(local_path)
    deal_with_route(local_path)

    print('Done')


if __name__ == "__main__":
    main()
