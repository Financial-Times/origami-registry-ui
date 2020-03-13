provider "fastly" {
  version = "~> 0.11"
}

resource "fastly_service_v1" "app" {
  activate    = true
  comment     = "Managed by Terraform"
  default_ttl = 3600
  name        = "origami registry ui"

  domain {
    name = "origami-registry.ft.com"
  }
  domain {
    name = "registry.origami.ft.com"
  }

  backend {
    address               = "origami-registry-ui-eu.herokuapp.com"
    auto_loadbalance      = false
    between_bytes_timeout = 10000
    connect_timeout       = 1000
    error_threshold       = 0
    first_byte_timeout    = 15000
    max_conn              = 200
    name                  = "EU"
    port                  = 80
    ssl_check_cert        = true
    use_ssl               = false
    weight                = 100
  }

  healthcheck {
    check_interval    = 15000
    expected_response = 200
    host              = "origami-repo-data-eu.herokuapp.com"
    http_version      = "1.1"
    initial           = 4
    method            = "HEAD"
    name              = "EU Healthcheck"
    path              = "/__health"
    threshold         = 3
    timeout           = 5000
    window            = 5
  }

  // Enable gzip compression.
  gzip {
    name = "Gzip"

    // Fastly's default extensions to compress.
    extensions = ["css", "js", "html", "eot", "ico", "otf", "ttf", "json", "svg"]

    // Fastly's default content types to compress.
    content_types = ["text/html", "application/x-javascript", "text/css", "application/javascript", "text/javascript", "application/json", "application/vnd.ms-fontobject", "application/x-font-opentype", "application/x-font-truetype", "application/x-font-ttf", "application/xml", "font/eot", "font/opentype", "font/otf", "image/svg+xml", "image/vnd.microsoft.icon", "text/plain", "text/xml"]
  }

  snippet {
    content  = <<EOT
								if (obj.status == 901) {
									 set obj.status = 301;
									 set obj.response = "Moved Permanently";
									 set obj.http.Location = "https://origami-bower-registry.ft.com" req.url;
									 synthetic {""};
									 return (deliver);
								}
						EOT
    name     = "Return redirect for bower paths"
    priority = 100
    type     = "error"
  }

  snippet {
    content  = <<EOT
								# Enable API key authentication for URL purge requests
								if ( req.request == "FASTLYPURGE" ) {
									set req.http.Fastly-Purge-Requires-Auth = "1";
								}
								
								if (!req.http.Fastly-SSL) {
									# 801 is a special error code that Fastly uses to Force SSL on the request
									error 801 "Redirect to HTTPS";
								}
								
								set req.url = boltsort.sort(req.url);
								
								if (req.url.path == "/packages" || req.url.path ~ "/packages/*" || req.url.path == "/stats" ) {
									error 901 "redirect to new bower service";
								}

                set req.http.Host = "origami-registry-ui-eu.herokuapp.com";

								if (req.request != "HEAD" && req.request != "GET" && req.request != "FASTLYPURGE") {
									return(pass);
								}
								
								return(lookup);
						EOT
    name     = "bower paths"
    priority = 1
    type     = "recv"
  }
}
