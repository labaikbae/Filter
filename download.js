var tong = 0;
var errorlogin = false;
var auto_refresh = setInterval(function(){$("#server_stats").load('download.php?infosv='+ Math.random());}, 1000);
var turnstileVerified = false;

function get(form) {
    var links = form.links.value;
    var submit = form.submit;
    
    if (links == "") {
        alert("Please insert your links!");
        form.links.focus();
        return false;
    }
    
    // Check if multiple links are entered
    var linkArray = links.split('\n').filter(function(line) {
        return line.trim() !== '';
    })
    
    // Process single link
    var singleLink = linkArray[0].trim();
    
    // List of premium-only filehosts
    var premiumFilehosts = [
        'filefox.cc',
        'fboom.me',
        'filejoker.net',
        'k2s.cc',
        'uploadgig.com'
    ];
    
    // Check if the link is from a premium-only filehost
    var isPremiumHost = true;
    var premiumHostName = 'Anonymous';
    
    for (var i = 0; i < premiumFilehosts.length; i++) {
        if (singleLink.includes(premiumFilehosts[i])) {
            isPremiumHost = true;
            premiumHostName = premiumFilehosts[i];
            break;
        }
    }
    
    if (isPremiumHost) {
        $("#showresults").html('<div class="alert alert-warning"><i class="fas fa-crown"></i> ' + premiumHostName + ' is only available for premium users. <a href="https://linkgen.vip/premium.php" target="_blank" class="alert-link">Upgrade to premium</a> to download from this filehost.</div>').show();
        form.links.focus();
        resetTurnstile();
        return false;
    }

    // Filehost domain conversions
    var domainConversions = {
        'katfile.com': 'katfile.cloud',
        'ddl.to': 'ddownload.com',
        'rg.to': 'rapidgator.net',
        'turb.cc': 'turbobit.net',
        'turb.to': 'turbobit.net',
        'trbt.cc': 'turbobit.net',
        'torbobit.net': 'turbobit.net',
        'm.turbobit.net': 'turbobit.net',
        'new.turbobit.net': 'turbobit.net',
        'htfl.net': 'hitfile.net',
        'clickndownload.cc': 'clicknupload.co',
        'clicknupload.cc': 'clicknupload.co',
        'clickndownload.site': 'clicknupload.co',
        'clickndownload.space': 'clicknupload.co',
        'clickndownload.xyz': 'clicknupload.co',
        'clicknupload.club': 'clicknupload.co',
        'clicknupload.link': 'clicknupload.co',
        'clicknupload.click': 'clicknupload.co',
        'clicknupload.download': 'clicknupload.co',
        'clicknupload.name': 'clicknupload.co',
        'clicknupload.one': 'clicknupload.co',
        'clicknupload.org': 'clicknupload.co',
        'clicknupload.space': 'clicknupload.co',
        'clicknupload.to': 'clicknupload.co'
    };
    
    // Apply domain conversions
    var originalLink = singleLink;
    for (var oldDomain in domainConversions) {
        if (singleLink.includes(oldDomain)) {
            singleLink = singleLink.replace(new RegExp(oldDomain, 'g'), domainConversions[oldDomain]);
        }
    }
    
    // Update the textarea with converted URL if changed
    if (originalLink !== singleLink) {
        form.links.value = singleLink;
    }
    
    // Sanitize filextras.com URLs
    if (singleLink.includes('filextras.com')) {
        var match = singleLink.match(/(https?:\/\/filextras\.com\/[a-zA-Z0-9]+)/i);
        if (match && match[1]) {
            singleLink = match[1];
        } else {
            singleLink = singleLink.replace(/\].*$/, '');
            singleLink = singleLink.replace(/\/[^\/]*$/, '');
        }
        
        // Update the textarea with sanitized URL
        form.links.value = singleLink;
    }
    
    submit.value = "Please Wait...";
    submit.disabled = true;
    
    $("#showresults").html('<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><br>Processing your link...</div>').show();
    
    $.post("download.php", {
        urllist: singleLink
    }, function(data) {
        $("#showresults").html(data).show();
        submit.value = "Generate";
        
        // Reset Turnstile after successful generation
        resetTurnstile();
        
        // Clear the textarea (replaces autoreset functionality)
        form.links.value = "";
        
    }).fail(function() {
        $("#showresults").html('<div class="alert alert-danger">Error processing link. Please try again.</div>').show();
        submit.value = "Generate";
        resetTurnstile();
    });
}

function reseturl() {
    document.linkform.links.value = "";
    document.linkform.links.focus();
    $("#showresults").hide();
    resetTurnstile();
}

function addlinks(all) {
    var links = document.linkform.links;
    
    // Check if already has content
    if (links.value.trim() !== "") {
        $("#showresults").html('<div class="alert alert-warning"><i class="fas fa-info-circle"></i> Please process the current link first or use Reset button!</div>').show();
        return false;
    }

    // Filehost domain conversions for addlinks function
    var domainConversions = {
        'katfile.com': 'katfile.cloud',
        'ddl.to': 'ddownload.com',
        'rg.to': 'rapidgator.net',
        'turb.cc': 'turbobit.net',
        'turb.to': 'turbobit.net',
        'trbt.cc': 'turbobit.net',
        'torbobit.net': 'turbobit.net',
        'new.turbobit.net': 'turbobit.net',
        'm.turbobit.net': 'turbobit.net',
        'htfl.net': 'hitfile.net',
        'clickndownload.cc': 'clicknupload.co',
        'clicknupload.cc': 'clicknupload.co',
        'clickndownload.site': 'clicknupload.co',
        'clickndownload.space': 'clicknupload.co',
        'clickndownload.xyz': 'clicknupload.co',
        'clicknupload.club': 'clicknupload.co',
        'clicknupload.link': 'clicknupload.co',
        'clicknupload.click': 'clicknupload.co',
        'clicknupload.download': 'clicknupload.co',
        'clicknupload.name': 'clicknupload.co',
        'clicknupload.one': 'clicknupload.co',
        'clicknupload.org': 'clicknupload.co',
        'clicknupload.space': 'clicknupload.co',
        'clicknupload.to': 'clicknupload.co'
    };
    
    // Apply domain conversions
    var originalAll = all;
    for (var oldDomain in domainConversions) {
        if (all.includes(oldDomain)) {
            all = all.replace(new RegExp(oldDomain, 'g'), domainConversions[oldDomain]);
        }
    }
    
    // Check if the added link is from a premium filehost
    var premiumFilehosts = [
        'filefox.cc',
        'fboom.me',
        'filejoker.net',
        'k2s.cc',
        'uploadgig.com'
    ];
    
    var isPremiumHost = false;
    var premiumHostName = '';
    
    for (var i = 0; i < premiumFilehosts.length; i++) {
        if (all.includes(premiumFilehosts[i])) {
            isPremiumHost = true;
            premiumHostName = premiumFilehosts[i];
            break;
        }
    }
    
    if (isPremiumHost) {
        $("#showresults").html('<div class="alert alert-warning"><i class="fas fa-crown"></i> ' + premiumHostName + ' is only available for premium users. <a href="https://linkgen.vip/premium.php" target="_blank" class="alert-link">Upgrade to premium</a> to download from this filehost.</div>').show();
        return false;
    }
    
    links.value = all;
    links.focus();
}

// No real-time prevention - just allow typing/pasting freely
document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.getElementById('links');
    if (textarea) {
        textarea.placeholder = "Insert Your Filehosts Link (Only 1 link at a time): (Example: https://katfile.cloud/xs9seburamus)";
        
        // Optional: Add input event to check for premium hosts while typing
        textarea.addEventListener('input', function() {
            var currentValue = this.value.trim();
            if (currentValue) {
                var premiumFilehosts = [
                    'filefox.cc',
                    'fboom.me',
                    'filejoker.net',
                    'k2s.cc'
                ];
                
                for (var i = 0; i < premiumFilehosts.length; i++) {
                    if (currentValue.includes(premiumFilehosts[i])) {
                        // Just show a small hint but don't block typing
                        console.log('Premium filehost detected: ' + premiumFilehosts[i]);
                        break;
                    }
                }
            }
        });
    }
});
