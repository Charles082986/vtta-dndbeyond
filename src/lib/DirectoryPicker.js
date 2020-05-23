/**
 * Game Settings: Directory
 */

class DirectoryPicker extends FilePicker {
  constructor(options = {}) {
    super(options);
  }

  _onSubmit(event) {
    event.preventDefault();
    const path = event.target.target.value;
    const activeSource = this.activeSource;
    const bucket = event.target.bucket ? event.target.bucket.value : null;
    this.field.value = DirectoryPicker.format({
      activeSource,
      bucket,
      path,
    });
    this.close();
  }

  static async uploadToPath(path, file) {
    const options = DirectoryPicker.parse(path);
    return FilePicker.upload(options.activeSource, options.current, file, { bucket: options.bucket });
  }

  // returns the type "Directory" for rendering the SettingsConfig
  static Directory(val) {
    return val;
  }

  // formats the data into a string for saving it as a GameSetting
  static format(value) {
    return value.bucket !== null
      ? `[${value.activeSource}:${value.bucket}] ${value.path}`
      : `[${value.activeSource}] ${value.path}`;
  }

  // parses the string back to something the FilePicker can understand as an option
  static parse(str) {
    let source;
    let matches = str.trim().match(/\[(.+)\]\s*(.+)/);
    if (matches) {
      source = matches[1];
      const [s3, bucket] = source.split(":");
      if (bucket !== undefined) {
        return {
          activeSource: s3,
          bucket: bucket,
          current: matches[2],
        };
      } else {
        return {
          activeSource: s3,
          bucket: null,
          current: matches[2],
        };
      }
    }
  }

  // Adds a FilePicker-Simulator-Button next to the input fields
  static processHtml(html) {
    $(html)
      .find(`input[data-dtype="Directory"]`)
      .each(function () {
        console.log("Adding Picker Button");
        let picker = new DirectoryPicker({
          field: $(this)[0],
          ...DirectoryPicker.parse(this.value),
        });
        let pickerButton = $(
          '<button type="button" class="file-picker" data-type="imagevideo" data-target="img" title="Pick directory"><i class="fas fa-file-import fa-fw"></i></button>'
        );
        pickerButton.on("click", function () {
          console.log(picker);
          picker.render(true);
        });
        $(this).parent().append(pickerButton);
      });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // remove unnecessary elements
    $(html).find("ol.files-list").remove();
    $(html).find("footer div").remove();
    $(html).find("footer button").text("Select Directory");
  }
}

Hooks.on("renderSettingsConfig", (app, html, user) => {
  DirectoryPicker.processHtml(html);
});

export default DirectoryPicker;