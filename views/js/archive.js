$(async function () {
    let response = await fetch(ARCHIVE_URL + "?token=" + sessionStorage.token);
    if (response.ok) {
        let data = await response.json();
        if (data.success) {
            loadArchivedPlaylists(data.archivedPlaylists);
        }
    }
})

function loadArchivedPlaylists(archives) {
    const container = $('#archive-container');

    container.find(".playlist-card").remove();

    if (archives.length === 0) {
        return;
    }else{
        $("#NotFound").hide();
    }

    archives.forEach(function (archive) {
        let image = archive.playlistpicture || archive.image;
        if (!image && archive.tracks && archive.tracks.length > 0) {
            if (typeof archive.tracks[0] === 'object') image = archive.tracks[0].albumImage;
        }
        image = image || "./assets/default-album.png";

        const card = $(`
            <div class="card playlist-card" data-id="${archive._id}" style="width: 200px;">
                <div class="card-image" style="background-image: url('${image}'); background-size: cover; background-position: center;"></div>
                <div class="card-info">
                    <p class="card-title">${archive.name}</p>
                    <p class="card-subtitle">${archive.tracks ? archive.tracks.length : 0} Tracks</p>
                </div>
                <button class="btn-unarchive">Unarchive</button>
            </div>
        `);

        card.find('.btn-unarchive').on('click', async function() {
            const archiveId = $(this).closest('.playlist-card').data('id');
            await unarchivePlaylist(archiveId);
        });

        container.append(card);
    });
}

async function unarchivePlaylist(archiveId) {
    try {
        const response = await fetch(`${ARCHIVE_URL}/${archiveId}/unarchive?token=${sessionStorage.token}`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message || "Playlist unarchived successfully");
            location.reload();
        } else {
            alert(data.message || "Failed to unarchive playlist");
        }
    } catch (error) {
        console.error("Error unarchiving playlist:", error);
        alert("An error occurred while unarchiving.");
    }
}