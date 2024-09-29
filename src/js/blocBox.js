$(function () {
    $(document).on("click", ".btUploadFile", function (e) {
        e.preventDefault();
        $(this).siblings("[type='file']").trigger('click');
    });

    $(document).on("change", ".file_doc_annex", function (e) {
        var filename = $(this).siblings("[type='text']");
        
        if ($(this).val() === "") {
            filename.val("");
            return;
        }

        var nomeArquivo = $(this)[0].files[0].name;
        var tamanhoArquivo = $(this)[0].files[0].size;
        var tipoArquivo = nomeArquivo.split(".").pop().toLowerCase();
        
        if (tipoArquivo !== "pdf") {
            $().funAvisoLight("Alerta|Permitido apenas arquivo no formato 'PDF'!", true);
            return;
        }

        if ((tamanhoArquivo / 1024 / 1024) > 10) {
            $().funAvisoLight("Alerta|Permitido apenas arquivos com até 10MB!", true);
            return;
        }

        filename.val(nomeArquivo);
    });
});
