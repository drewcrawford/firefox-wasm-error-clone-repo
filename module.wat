(module
  (type $probe_t (func (param externref externref) (result externref)))
  (import "env" "probe_value" (func $probe_value (type $probe_t)))
  (func (export "run_probe") (param externref externref) (result externref)
    local.get 0
    local.get 1
    call $probe_value))
