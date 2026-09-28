param(
    [int]$Port = 8080,
    [string]$Path = $PSScriptRoot
)

$serverCode = @'
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Collections.Generic;

public class FastServer {
    private HttpListener listener;
    private string rootPath;
    private static readonly Dictionary<string, string> mimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".css", "text/css; charset=utf-8" },
        { ".js", "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".png", "image/png" },
        { ".svg", "image/svg+xml" },
        { ".ico", "image/x-icon" },
        { ".webp", "image/webp" }
    };

    public FastServer(string path, int port) {
        rootPath = Path.GetFullPath(path);
        listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
    }

    public void Start() {
        listener.Start();
        Console.WriteLine("Server listening at " + string.Join(", ", listener.Prefixes));
        listener.BeginGetContext(OnRequest, null);
    }

    private void OnRequest(IAsyncResult ar) {
        if (!listener.IsListening) return;
        try {
            HttpListenerContext context = listener.EndGetContext(ar);
            listener.BeginGetContext(OnRequest, null);
            ProcessRequest(context);
        } catch {
            if (listener.IsListening) {
                try { listener.BeginGetContext(OnRequest, null); } catch {}
            }
        }
    }

    private void ProcessRequest(HttpListenerContext context) {
        try {
            var req = context.Request;
            var res = context.Response;

            res.Headers.Add("Access-Control-Allow-Origin", "*");
            string extLower = Path.GetExtension(req.Url.AbsolutePath).ToLower();
            if (extLower == ".jpg" || extLower == ".jpeg" || extLower == ".png" || extLower == ".webp") {
                res.Headers.Add("Cache-Control", "public, max-age=86400");
            } else {
                res.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
                res.Headers.Add("Pragma", "no-cache");
                res.Headers.Add("Expires", "0");
            }

            string url = Uri.UnescapeDataString(req.Url.AbsolutePath.TrimStart('/'));
            if (string.IsNullOrEmpty(url)) url = "index.html";

            string filePath = Path.Combine(rootPath, url.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(filePath)) {
                string ext = Path.GetExtension(filePath);
                string mime;
                if (!mimeTypes.TryGetValue(ext, out mime)) mime = "application/octet-stream";
                res.ContentType = mime;

                byte[] bytes = File.ReadAllBytes(filePath);
                res.ContentLength64 = bytes.Length;

                if (!string.Equals(req.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase)) {
                    res.OutputStream.Write(bytes, 0, bytes.Length);
                }
            } else {
                res.StatusCode = 404;
                byte[] notFound = Encoding.UTF8.GetBytes("404 Not Found");
                res.ContentLength64 = notFound.Length;
                if (!string.Equals(req.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase)) {
                    res.OutputStream.Write(notFound, 0, notFound.Length);
                }
            }
            res.Close();
        } catch {
            try { context.Response.Abort(); } catch {}
        }
    }

    public void Stop() {
        try { listener.Stop(); } catch {}
    }
}
'@

Add-Type -TypeDefinition $serverCode

$server = New-Object FastServer($Path, $Port)
$server.Start()

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $server.Stop()
}
