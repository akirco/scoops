## search app

- install

```powershell
# Hash:C800563B3CDF73B7909A9BC554AD088644A7854875D1DEDD73B80703576BEABE
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
