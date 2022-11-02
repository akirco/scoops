## search app

- install

```powershell
# Hash:6419C35288BF483547D1BBD0520C7A55D8CBF6CA153CF8B68156A36A2C26DEC8
scoop bucket add aki 'https://github.com/akirco/aki-apps.git'
scoop i scoops
```

```powershell
Usage: scoops [options]

Options:
  -v, --version  output the current version
  -l,--local     search apps from local buckets (default: true)
  -r,--remote    search apps from remote buckets
  -h, --help     display help for command

  Example:
    remote search: $ scoops <wechat> <-r/--remote> [count,default=20]

    local search: $ scoops <wechat> [-l/--local]

    update local source: $ scoops -u
```

---
