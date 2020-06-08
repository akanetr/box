//=============================================================================
// RecollectionMode_through_command_patch.js

// RecollectionMode(https://github.com/rinne-grid/tkoolmv_plugin_RecollectionMode)
// Copyright (c) 2016 rinne_grid
// This plugin is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @plugindesc RecollectionMode�̃p�b�`�ł��B�^�C�g�����璼�ډ�z�{���ɑJ�ڂ��܂�
 * @author rinne_grid
 *
 *
 * @help ���̃v���O�C���ɂ́A�v���O�C���R�}���h�͂���܂���B
 *
 */

    // ��z���[�h�̃J�[�\��
    Scene_Recollection.rec_list_index = 0;

    // ��z���[�h�̔w�i�ɕ\������摜
    Scene_Recollection.background_image_name = "background";

    Scene_Recollection.prototype.createCommandWindow = function() {

        // ��z���[�h�I���E�B���h�E
        this._rec_window = new Window_RecollectionCommand();
        this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
        this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
        this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));

        // �p�b�`�F�I���E�B���h�E���\���ɂ���B�ʏ�͂�����true
        this._rec_window.visible = false;
        this._rec_window.deactivate();
        this.addWindow(this._rec_window);

        // ��z���X�g
        this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);

        // �p�b�`�F��z���X�g��\���ɂ���B�ʏ�͂�����false
        this._rec_list.visible = true;
        this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
        this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
        this._mode = "recollection";
        this._rec_list.activate();
        this._rec_list.select(Scene_Recollection.rec_list_index);
        this._rec_list.opacity = 0;

        this.addWindow(this._rec_list);

        // CG�Q�Ɨp�_�~�[�R�}���h
        this._dummy_window = new Window_Command(0, 0);
        this._dummy_window.deactivate();
        this._dummy_window.visible = false;
        this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
        this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
        this._dummy_window.addCommand('next', 'ok');
        this.addWindow(this._dummy_window);



    };

    //-------------------------------------------------------------------------
    // �� ��zorCG���[�h����u�L�����Z���v���đO�̉�ʂɖ߂����ꍇ�̃R�}���h
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandBackSelectMode = function() {
        // �^�C�g���ɖ߂�ꍇ�́A�C���f�b�N�X�����Z�b�g����
        Scene_Recollection.rec_list_index = 0;
        SceneManager.goto(Scene_Title);
    };

    //-------------------------------------------------------------------------
    // �� ��zorCG���[�h�ɂ����āA���ۂ̉�zorCG��I�������ꍇ�̃R�}���h
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandDoRecMode = function() {
        var target_index = this._rec_list.index() + 1;
        Scene_Recollection.rec_list_index = target_index - 1;

        if (this._rec_list.is_valid_picture(this._rec_list.index() + 1)) {
            // ��z���[�h�̏ꍇ
            if (this._mode == "recollection") {
                Scene_Recollection._rngd_recollection_doing = true;

                DataManager.setupNewGame();
                $gamePlayer.setTransparent(255);
                this.fadeOutAll();

                //$dataSystem.optTransparent = false;
                $gameTemp.reserveCommonEvent(rngd_recollection_mode_settings.rec_cg_set[target_index]["common_event_id"]);
                $gamePlayer.reserveTransfer(rngd_recollection_mode_settings.sandbox_map_id, 0, 0, 0);
                SceneManager.push(Scene_Map);

                // CG���[�h�̏ꍇ
            } else if (this._mode == "cg") {
                this._cg_sprites = [];
                this._cg_sprites_index = 0;

                // �V�[���摜�����[�h����
                rngd_recollection_mode_settings.rec_cg_set[target_index].pictures.forEach(function (name) {
                    var sp = new Sprite();
                    sp.bitmap = ImageManager.loadPicture(name);
                    // �ŏ���Sprite�ȊO�͌����Ȃ��悤�ɂ���
                    if (this._cg_sprites.length > 0) {
                        sp.visible = false;
                    }

                    // TODO: ��ʃT�C�Y�ɂ��킹�āA�g��E�k�����ׂ�
                    this._cg_sprites.push(sp);
                    this.addChild(sp);

                }, this);

                this.do_exchange_status_window(this._rec_list, this._dummy_window);
                this._dummy_window.visible = false;
            }
        } else {
            this._rec_list.activate();
        }
    };
